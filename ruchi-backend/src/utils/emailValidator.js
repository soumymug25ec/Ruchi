const { ALLOWED_INSTITUTIONS } = require("../config/constants");

function getEmailDomain(email) {
  const parts = String(email).split("@");
  return parts.length === 2 ? parts[1].toLowerCase() : null;
}

function validateInstitutionEmail(email) {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  if (ALLOWED_INSTITUTIONS.length === 0) return true; // no allowlist configured
  return ALLOWED_INSTITUTIONS.includes(domain);
}

module.exports = { validateInstitutionEmail, getEmailDomain };
