import { Request, Response } from "express";
import { Message } from "../models/Message";
import { User } from "../models/User";

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { forum_id, content, receiver_id } = req.body as {
      forum_id: number;
      content: string;
      receiver_id?: number;
    };

    const user = req.user!; // tipado como AuthenticatedUser via express.d.ts

    if (!forum_id || !content) {
      res.status(400).json({ message: "Fórum e conteúdo são obrigatórios" });
      return;
    }

    const message = await Message.create({
      forum_id,
      sender_id: user.id,
      receiver_id: receiver_id ?? null,
      content,
      is_private: !!receiver_id,
    });

    res.status(201).json(message);
  } catch {
    res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
};

export const getMessagesByForum = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = Number(req.params.forumId);
    const user = req.user!;

    // JOIN com User — resolve N+1 (uma query só)
    const messages = await Message.findAll({
      where: { forum_id: forumId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["username"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    // Filtra mensagens privadas: só remetente e destinatário veem
    const visibleMessages = messages.filter((msg) => {
      if (!msg.is_private) return true;
      return msg.sender_id === user.id || msg.receiver_id === user.id;
    });

    const result = visibleMessages.map((msg) => {
      const json = msg.toJSON() as unknown as Record<string, unknown> & {
        sender?: { username: string };
      };

      return {
        ...json,
        username: json.sender?.username ?? `Usuário ${msg.sender_id}`,
      };
    });

    res.json(result);
  } catch {
    res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
};