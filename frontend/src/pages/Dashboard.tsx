import { useEffect, useState } from "react";
import { api } from "../services/api";
import "./Dashboard.css";

type Forum = {
  id: number;
  name: string;
  description?: string;
  created_by: number;
};

type DashboardProps = {
  onEnterForum: (forum: Forum) => void;
};

export function Dashboard({ onEnterForum }: DashboardProps) {
  const [forums, setForums] = useState<Forum[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  async function loadForums() {
    const response = await api.get("/forums");
    setForums(response.data);
  }

  async function createForum() {
    if (!name.trim()) {
      alert("Digite o nome do fórum");
      return;
    }

    await api.post(
      "/forums",
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setName("");
    setDescription("");
    loadForums();
  }

  useEffect(() => {
    loadForums();
  }, []);

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="logo">
          <span>Tech</span>
          <strong>4um</strong>
        </div>

        <p>Seu fórum sobre tecnologia!</p>

        <div className="user-info">
  <div className="user-text">
    <strong>{user.username}</strong>
    <span>{user.email}</span>
  </div>

  <button
    onClick={() => {
      localStorage.clear();
      window.location.reload();
    }}
  >
    Sair
  </button>
</div>
      </header>

      <section className="dashboard-intro">
        <h1>Opa!</h1>
        <p>Sobre o que gostaria de falar hoje?</p>
      </section>

      <section className="create-forum">
        <input
          placeholder="Nome do 4um"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={createForum}>Crie seu próprio 4um</button>
      </section>

      <section className="forums-grid">
        {forums.map((forum) => (
          <article
            key={forum.id}
            className="forum-card"
            onClick={() => onEnterForum(forum)}
          >
            <span>Tópico em destaque!</span>
            <h2>{forum.name}</h2>
            <p>{forum.description || "Sem descrição"}</p>

            <footer>
              <small>Criado por: usuário #{forum.created_by}</small>
              <button>+{forum.id}</button>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}