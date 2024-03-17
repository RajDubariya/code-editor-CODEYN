import express from "express";
import http from "http";
import { Server } from "socket.io";
import ACTIONS from "./src/Action.js";

const app = express();
const server = http.createServer(app);
const PORT = 8000;

const io = new Server(server);

const userSocketMap = {};
const currentCode = {};

function getAllConnectedUsers(roomid) {
  return Array.from(io.sockets.adapter.rooms.get(roomid)).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    };
  });
}

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomid, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomid);
    const clients = getAllConnectedUsers(roomid);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
    io.to(socket.id).emit(ACTIONS.SYNC_CODE, currentCode[roomid] || "");
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomid, code }) => {
    socket.to(roomid).emit(ACTIONS.SYNC_CODE, code);
    currentCode[roomid] = code;
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      if (getAllConnectedUsers(roomId).length === 1) {
        delete currentCode[roomId];
      }
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

server.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
