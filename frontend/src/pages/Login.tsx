import { useState } from "react";
import { api } from "../services/api";
import "./Login.css";

type LoginProps = {
  onLogin: () => void;
};

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    if (!username || !email) {
      alert("Preencha nome e e-mail");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/identify", {
        username,
        email,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onLogin();
    } catch (error) {
      alert("Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

      return (
  <main className="login-page">
    <section className="login-card">

      <span className="login-tag">Login</span>

      <h2>Que bom ter você aqui!</h2>

      <p>
        Para participar de um 4um é necessário fazer login.
      </p>

      <form onSubmit={handleLogin}>
            
          <label>Nome</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}