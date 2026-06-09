import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../services/api";

const socket = io("http://localhost:3000");

type Forum = {
  id: number;
  name: string;
};

type Message = {
  forum_id: number;
  username?: string;
  content: string;
  sender_id?: number;
};

type ChatProps = {
  forum: Forum;
  onBack: () => void;
};

export function Chat({ forum, onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function loadMessages() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/messages/${forum.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(response.data);
    } catch (error) {
      console.error("Erro ao carregar mensagens", error);
    }
  }
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    loadMessages();
  
    socket.emit("user_connected", {
      id: user.id,
      username: user.username,
    });
  
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });
  
    socket.emit("join_forum", forum.id);
  
    socket.on("receive_message", (message: Message) => {
      if (message.forum_id === forum.id) {
        setMessages((prev) => [...prev, message]);
      }
    });
  
    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, [forum.id]);

  function sendMessage() {
    if (!content.trim()) return;

    const message = {
      forum_id: forum.id,
      username: user.username,
      content,
    };

    socket.emit("send_message", message);
    setContent("");
  }

  return (
    <div style={{ padding: 24 }}>
      <button onClick={onBack}>← Voltar</button>

      <h1>{forum.name}</h1>
      <h3>Participantes Online</h3>

<div>
  {onlineUsers.map((onlineUser) => (
    <p key={onlineUser.id}>
      🟢 {onlineUser.username}
    </p>
  ))}
</div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          height: 400,
          overflowY: "auto",
          marginTop: 16,
        }}
      >
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.username || `Usuário ${message.sender_id}`}</strong>
            : {message.content}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua mensagem"
          style={{ padding: 10, width: "80%" }}
        />

        <button onClick={sendMessage} style={{ marginLeft: 8, padding: 10 }}>
          Enviar
        </button>
      </div>
    </div>
  );
}