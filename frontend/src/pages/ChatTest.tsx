import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type Message = {
  forum_id: number;
  username: string;
  content: string;
};

export function ChatTest() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.emit("join_forum", 1);

    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  function sendMessage() {
    if (!content.trim()) return;

    const message = {
      forum_id: 1,
      username: "Aline",
      content,
    };

    socket.emit("send_message", message);
    setContent("");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Chat Teste - Fórum React</h1>

      <div style={{ border: "1px solid #ccc", padding: 16, height: 300 }}>
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.username}:</strong> {message.content}
          </p>
        ))}
      </div>

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite sua mensagem"
        style={{ marginTop: 16, padding: 8, width: 300 }}
      />

      <button onClick={sendMessage} style={{ marginLeft: 8, padding: 8 }}>
        Enviar
      </button>
    </div>
  );
}