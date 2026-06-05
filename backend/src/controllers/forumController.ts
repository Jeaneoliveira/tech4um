import { Request, Response } from "express";
import { Forum } from "../models/Forum";

export const createForum = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const user = (req as any).user;

    const forum = await Forum.create({
      name,
      description,
      created_by: user.id,
    });

    return res.status(201).json(forum);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar fórum",
    });
  }
};

export const getForums = async (_req: Request, res: Response) => {
  try {
    const forums = await Forum.findAll();

    return res.json(forums);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar fóruns",
    });
  }
};