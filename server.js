// server.js
const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const startSocket = require("./src/socket/socket");

// socket connection
startSocket(server);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
