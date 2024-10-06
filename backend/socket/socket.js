import { Server } from "socket.io";
import http from "http";
import express from "express";

let app = express();

let server = http.createServer(app);

let io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let socketMap = {};

io.on("connection", (socket) => {
  // console.log("user connected", socket.id);

  let userId = socket.handshake.query.userId;

  if (userId != undefined) {
    socketMap[userId] = socket.id;
    // console.log(socketMap );
  }

  io.emit("getonlineusers", Object.keys(socketMap)); // object ko array me convert kia hai


  socket.on("disconnect", (reason) => {
    // console.log(`socket ${socket.id} disconnected due to ${reason}`);
    delete socketMap[userId];
    io.emit("getonlineusers", Object.keys(socketMap)); // object ko array me convert kia hai
  });
});

let getSocketId = (receiverId)=>{
  return socketMap[receiverId]
}

export { app, server, io, getSocketId };

// console.log(process.env.HOST);
