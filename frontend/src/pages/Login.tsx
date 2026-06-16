import { useState } from "react";
import { api } from "../services/api";
import "./Login.css";
import { useAppContext } from "../contexts/AppContext";

// onLogin removido — navegação controlada pelo AppContext (isLogged)
export function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAppContext();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    if (!email || !password) {
      alert("Preencha e-mail e senha");
      return;
    }

    if (isRegister && !username) {
      alert("Preencha o nome para cadastrar");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister ? { username, email, password } : { email, password };
      const response = await api.post(endpoint, body);

      // login() atualiza o context → App.tsx re-renderiza automaticamente para o Dashboard
      login(response.data.token, response.data.user);
    } catch {
      alert(isRegister ? "Erro ao cadastrar" : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <span className="login-tag">
          {isRegister ? "Cadastro" : "Login"}
        </span>

        <h2>Que bom ter você aqui!</h2>

        <p>Para participar de um 4um é necessário fazer login.</p>

        <form onSubmit={handleLogin}>
          {isRegister && (
            <>
              <label>Nome</label>
              <input
                type="text"
                placeholder="Digite seu nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? isRegister ? "Cadastrando..." : "Entrando..."
              : isRegister ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          className="login-switch"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Já tenho conta" : "Criar nova conta"}
        </button>
      </section>
    </main>
  );
}
