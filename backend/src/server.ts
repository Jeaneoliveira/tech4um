import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";

import { sequelize } from "./database/connection";
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

type OnlineUser = {
  id: number;
  username: string;
};

const onlineUsers = new Map<string, OnlineUser>();
const userSockets = new Map<number, string>();

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  socket.on("user_connected", (user: OnlineUser) => {
    onlineUsers.set(socket.id, user);
    userSockets.set(user.id, socket.id);

    const uniqueUsers = Array.from(
      new Map(
        Array.from(onlineUsers.values()).map((user) => [user.id, user])
      ).values()
    );

    io.emit("online_users", uniqueUsers);
  });

  socket.on("join_forum", (forumId: number) => {
    socket.join(`forum_${forumId}`);
    console.log(`Usuário ${socket.id} entrou no fórum ${forumId}`);
  });

  socket.on("send_message", (data) => {
    if (data.is_private && data.receiver_id) {
      const receiverSocketId = userSockets.get(data.receiver_id);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
      }

      socket.emit("receive_message", data);
      return;
    }

    io.to(`forum_${data.forum_id}`).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    const disconnectedUser = onlineUsers.get(socket.id);

    if (disconnectedUser) {
      userSockets.delete(disconnectedUser.id);
    }

    onlineUsers.delete(socket.id);

    const uniqueUsers = Array.from(
      new Map(
        Array.from(onlineUsers.values()).map((user) => [user.id, user])
      ).values()
    );

    io.emit("online_users", uniqueUsers);

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