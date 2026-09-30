const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ruchi-backend" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/interests", require("./routes/interests"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/moderator", require("./routes/moderator"));

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

module.exports = app;
