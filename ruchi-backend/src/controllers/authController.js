const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const { generatePseudonym } = require("../utils/generatePseudonym");
const { validateInstitutionEmail, getEmailDomain } = require("../utils/emailValidator");
const { REQUIRE_EMAIL_VERIFICATION } = require("../config/constants");

function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      pseudonym: user.pseudonym,
      institutionId: user.institution_id,
      isModerator: !!user.is_moderator,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
}

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    if (!validateInstitutionEmail(email)) {
      return res.status(400).json({ error: "Email must be from an approved institution" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const domain = getEmailDomain(email);
    const inst = await pool.query(
      "SELECT id FROM institutions WHERE email_domain = $1",
      [domain]
    );
    if (inst.rows.length === 0) {
      return res.status(400).json({ error: "Institution not recognized" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let pseudonym;
    // Retry on the rare pseudonym collision (unique constraint)
    for (let attempt = 0; attempt < 5; attempt++) {
      pseudonym = generatePseudonym();
      const clash = await pool.query("SELECT id FROM users WHERE pseudonym = $1", [pseudonym]);
      if (clash.rows.length === 0) break;
    }

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    const emailVerified = !REQUIRE_EMAIL_VERIFICATION;

    const result = await pool.query(
      `INSERT INTO users (institution_id, email, password_hash, pseudonym, email_verified, verification_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, pseudonym, email_verified`,
      [inst.rows[0].id, email, hashedPassword, pseudonym, emailVerified, verificationCode]
    );

    const user = result.rows[0];

    // No SMTP configured in this environment — log the code instead of emailing it.
    if (!emailVerified) {
      console.log(`[dev] Verification code for ${email}: ${verificationCode}`);
    }

    res.status(201).json({
      message: emailVerified
        ? "Signup successful. You can sign in now."
        : "Signup successful. Check your email for a verification code.",
      user_id: user.id,
      pseudonym: user.pseudonym,
      email_verified: user.email_verified,
      ...(emailVerified ? {} : { dev_verification_code: verificationCode }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Signup failed" });
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, verification_code } = req.body;

    const result = await pool.query(
      "SELECT id, verification_code, email_verified FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    if (user.email_verified) {
      return res.json({ message: "Email already verified" });
    }
    if (user.verification_code !== verification_code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await pool.query(
      "UPDATE users SET email_verified = true, verification_code = NULL WHERE id = $1",
      [user.id]
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Verification failed" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      `SELECT id, email, password_hash, pseudonym, email_verified, institution_id, is_moderator
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.email_verified) {
      return res.status(403).json({ error: "Please verify your email first" });
    }

    await pool.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1", [user.id]);

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        pseudonym: user.pseudonym,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
}

async function logout(req, res) {
  // Stateless JWT — client just discards the token. Endpoint kept for API symmetry.
  res.json({ message: "Logged out successfully" });
}

module.exports = { signup, verifyEmail, login, logout };
