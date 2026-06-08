import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import { sequelize } from "./database/connection";

import "./models/User";
import "./models/Forum";
import "./models/Message";

import authRoutes from "./routes/authRoutes";
import forumRoutes from "./routes/forumRoutes";
import messageRoutes from "./routes/messageRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/forums", forumRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Tech4um rodando 🚀" });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  socket.on("join_forum", (forumId) => {
    socket.join(`forum_${forumId}`);
    console.log(`Usuário ${socket.id} entrou no fórum ${forumId}`);
  });

  socket.on("send_message", (data) => {
    io.to(`forum_${data.forum_id}`).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso");

    httpServer.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Erro ao conectar no banco:", error);
  });