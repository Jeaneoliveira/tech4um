import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../services/api";
import "./Chat.css";

const socket = io("http://localhost:3000");

type Forum = {
  id: number;
  name: string;
  description?: string;
  created_by?: number;
};

type Message = {
  id?: number;
  forum_id: number;
  username?: string;
  content: string;
  sender_id?: number;
  receiver_id?: number | null;
  receiver_name?: string | null;
  is_private?: boolean;
  time?: string;
};

type Participant = {
  id: number;
  name: string;
};

type ChatProps = {
  forum: Forum;
  onBack: () => void;
};

const mockParticipants: Participant[] = [
  { id: 3, name: "Lara Alves" },
  { id: 4, name: "Luiz Antonio Magalhães" },
  { id: 5, name: "Gustavo Marcondes" },
  { id: 6, name: "Lucas Pinheiro" },
  { id: 7, name: "Bruna Pires Lacerda" },
  { id: 8, name: "Gabriela Rodrigues Souza" },
  { id: 9, name: "Leandro Silva Maciel" },
  { id: 10, name: "Sandra Reis" },
  { id: 11, name: "Wellington Resende Pereira" },
  { id: 12, name: "José Thiago Miranda" },
  { id: 13, name: "Amanda Oliveira" },
  { id: 14, name: "Camila Santana" },
  { id: 15, name: "Alberto Teixeira" },
];

export function Chat({ forum, onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [forums, setForums] = useState<Forum[]>([]);
  const [showParticipants] = useState(true);
  const [privateTo, setPrivateTo] = useState<Participant | null>(null);

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

  async function loadForums() {
    try {
      const response = await api.get("/forums");
      setForums(response.data);
    } catch (error) {
      console.error("Erro ao carregar fóruns", error);
    }
  }

  useEffect(() => {
    loadMessages();
    loadForums();

    socket.emit("user_connected", {
      id: user.id,
      username: user.username,
    });

    socket.emit("join_forum", forum.id);

    socket.on("receive_message", (message: Message) => {
      if (message.forum_id === forum.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [forum.id]);

  async function sendMessage() {
    if (!content.trim()) return;
  
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
      const response = await api.post(
        "/messages",
        {
          forum_id: forum.id,
          content,
          receiver_id: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const message = {
        ...response.data,
        username: user.username,
        receiver_name: privateTo?.name || null,
        is_private: !!privateTo,
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
  
      socket.emit("send_message", message);
  
      setContent("");
      setPrivateTo(null);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem");
    }
  }

  return (
    <main className="chat-page">
      <header className="app-header">
        <div className="logo-area">
          <span>Seu fórum sobre tecnologia!</span>
        </div>
      </header>

      <div className="chat-top-bar">
        <button onClick={onBack}>← Voltar para o dashboard</button>
      </div>

      <section className="chat-layout-three">
        {showParticipants && (
          <aside className="participants-panel">
            <div className="participants-header">
              <h3>Participantes</h3>
            </div>

            {mockParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className="participant-item"
                onClick={() => setPrivateTo(participant)}
              >
                <div className={`participant-avatar color-${index % 6}`}>
                  {participant.name.charAt(0)}
                </div>

                <span>{participant.name}</span>
              </div>
            ))}
          </aside>
        )}

        <div className="chat-box">
          <div className="chat-forum-header">
            <h3>{forum.name}</h3>
            <span>
            Criado por: <strong>{user.username}</strong>
            </span>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.is_private ? "private-message" : ""}`}
              >
               <div className="message-header">
  <strong>{message.username || `Usuário ${message.sender_id}`}</strong>

  <span className="message-time">
    {message.time}
  </span>
</div>

                {message.is_private && (
  <span className="private-label">
    🔒 Mensagem privada
  </span>
)}

                <p>{message.content}</p>
              </div>
            ))}
          </div>

          <div className={privateTo ? "send-mode private-mode" : "send-mode"}>
            {privateTo ? (
              <>
                🔒 Privado para {privateTo.name.split(" ")[0]}
                <button onClick={() => setPrivateTo(null)}>Cancelar</button>
              </>
            ) : (
              "Enviando para todos do 4um"
            )}
          </div>

          <div className="chat-input">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva aqui uma mensagem..."
            />

            <button onClick={sendMessage}>➤</button>
          </div>
        </div>

        <aside className="rooms-panel">
          {forums.map((item) => (
            <div
              key={item.id}
              className={`room-card ${item.id === forum.id ? "active-room" : ""}`}
            >
              <strong>{item.name}</strong>
              <span>Um 4um • 70 pessoas</span>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}