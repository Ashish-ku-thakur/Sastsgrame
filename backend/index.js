import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DB_CONNECTION } from "./utils/db_connection.js";
import userRouter from "./router/userRouter.js";
import postRouter from "./router/postRouter.js";
import commentRouter from "./router/commentRouter.js";
import messageRouter from "./router/messageRouter.js";
import cookieParser from "cookie-parser";
import { io, server, app } from "./socket/socket.js";
import path from "path";

dotenv.config({});
// let app = express();

let corsOption = {
  origin: process.env.FRONTEND_PORT,
  credentials: true,
};

let _dirname = path.resolve();

// middelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOption));
app.use(cookieParser());

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/message", messageRouter);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

server.listen(process.env.PORT, () => {
  DB_CONNECTION();
  console.log(`server started on port ${process.env.PORT}`);
});
