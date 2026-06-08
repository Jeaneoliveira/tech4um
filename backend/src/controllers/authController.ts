import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const identify: RequestHandler = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      res.status(400).json({ message: "Nome e e-mail são obrigatórios" });
      return;
    }

    let user: any = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        username,
        email,
        password: "no-password",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Identificação realizada com sucesso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao identificar usuário" });
  }
};