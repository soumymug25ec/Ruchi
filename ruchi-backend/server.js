const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = require("./src/app");
const { attachSocket } = require("./src/realtime/socket");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});
attachSocket(io);
app.set("io", io);

server.listen(PORT, () => {
  console.log(`🚀 Ruchi backend running on http://localhost:${PORT}`);
});
