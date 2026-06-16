import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
  res.json({ message: "API Tech4um rodando" });
});

export default app;