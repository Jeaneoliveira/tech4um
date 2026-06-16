import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import bcryptjs from "bcryptjs";

export const register: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios" });
      return;
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(400).json({ message: "E-mail já cadastrado" });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({  
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "E-mail e senha são obrigatórios",
      });
      return;
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        message: "E-mail ou senha inválidos",
      });
      return;
    }

    const passwordValid = await bcryptjs.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      res.status(401).json({
        message: "E-mail ou senha inválidos",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao fazer login",
    });
  }
};