import { Request, Response } from "express";
import { Message } from "../models/Message";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { forum_id, content, receiver_id } = req.body;
    const user = (req as any).user;

    if (!forum_id || !content) {
      return res.status(400).json({ message: "Fórum e conteúdo são obrigatórios" });
    }

    const message = await Message.create({
      forum_id,
      sender_id: user.id,
      receiver_id: receiver_id || null,
      content,
      is_private: !!receiver_id,
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
};

export const getMessagesByForum = async (req: Request, res: Response) => {
  try {
    const { forumId } = req.params;
    const user = (req as any).user;

    const messages = await Message.findAll({
      where: {
        forum_id: forumId,
      },
      order: [["created_at", "ASC"]],
    });

    const visibleMessages = messages.filter((message: any) => {
      if (!message.is_private) return true;

      return (
        message.sender_id === user.id ||
        message.receiver_id === user.id
      );
    });

    return res.json(visibleMessages);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
};