import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./database/connection";
import "./models/User";
import authRoutes from "./routes/authRoutes";
import "./models/Forum";
import forumRoutes from "./routes/forumRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/forums", forumRoutes);
app.get("/", (req, res) => {
  res.json({ message: "API Tech4um rodando 🚀" });
});

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Erro ao conectar no banco:", error);
  });