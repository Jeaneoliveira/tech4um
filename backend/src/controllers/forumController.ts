import { Request, Response } from "express";
import { Forum } from "../models/Forum";
import { User } from "../models/User";

export const createForum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body as { name: string; description?: string };
    const user = req.user!;

    const forum = await Forum.create({
      name,
      description,
      created_by: user.id,
    });

    res.status(201).json(forum);
  } catch {
    res.status(500).json({ message: "Erro ao criar fórum" });
  }
};

export const getForums = async (_req: Request, res: Response): Promise<void> => {
  try {
    const forums = await Forum.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    });

    // Retorna os fóruns com creator_username no nível raiz
    const result = forums.map((forum) => {
      const json = forum.toJSON() as unknown as Record<string, unknown> & {
        creator?: { username: string };
      };

      return {
        ...json,
        creator_username: json.creator?.username ?? `Usuário #${forum.getDataValue("created_by")}`,
      };
    });

    res.json(result);
  } catch {
    res.status(500).json({ message: "Erro ao listar fóruns" });
  }
};