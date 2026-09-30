function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "23505") {
    // Postgres unique_violation
    return res.status(409).json({ error: "That record already exists" });
  }

  res.status(err.status || 500).json({
    error: err.publicMessage || "Internal server error",
  });
}

module.exports = { errorHandler };
