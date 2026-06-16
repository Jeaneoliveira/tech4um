import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import { useAppContext } from "./contexts/AppContext";

function App() {
  // Tudo vem do context — sem props drilling, sem useState local de auth
  const { user, token, selectedForum, setSelectedForum } = useAppContext();

  // Não logado → Login
  if (!user || !token) {
    return <Login />;
  }

  // Fórum selecionado → Chat
  if (selectedForum) {
    return <Chat forum={selectedForum} onBack={() => setSelectedForum(null)} />;
  }

  // Default → Dashboard
  return <Dashboard onEnterForum={setSelectedForum} />;
}

export default App;
