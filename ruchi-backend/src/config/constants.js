require("dotenv").config();

const ALLOWED_INSTITUTIONS = (process.env.ALLOWED_INSTITUTIONS || "")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

const REQUIRE_EMAIL_VERIFICATION =
  process.env.REQUIRE_EMAIL_VERIFICATION === "true";

module.exports = { ALLOWED_INSTITUTIONS, REQUIRE_EMAIL_VERIFICATION };
