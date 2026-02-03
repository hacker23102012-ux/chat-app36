// ===== IMPORT =====
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// ===== SETUP =====
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ===== STATIC FILE =====
app.use(express.static("public"));

// ===== LƯU LỊCH SỬ CHAT (RAM) =====
let chatHistory = [];

// ===== SOCKET =====
io.on("connection", (socket) => {

  // khi user vào chat
  socket.on("join", (username) => {
    socket.username = username;

    // gửi lịch sử cho người mới
    socket.emit("history", chatHistory);

    // thông báo hệ thống
    io.emit("system", `${username} đã vào phòng`);
  });

  // khi gửi tin nhắn
  socket.on("chat", (text) => {
    if (!socket.username) return;

    const data = {
      user: socket.username,
      text
    };

    chatHistory.push(data);

    // giới hạn 100 tin
    if (chatHistory.length > 100) {
      chatHistory.shift();
    }

    io.emit("chat", data);
  });

  // khi thoát
  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("system", `${socket.username} đã rời phòng`);
    }
  });
});

// ===== LISTEN (QUAN TRỌNG CHO RENDER) =====
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
