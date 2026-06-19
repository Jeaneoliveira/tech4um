import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import { useAppContext } from "./contexts/AppContext";

function App() {
    const { user, token, selectedForum, setSelectedForum } = useAppContext();

  if (!user || !token) {
    return <Login />;
  }

  if (selectedForum) {
    return <Chat forum={selectedForum} onBack={() => setSelectedForum(null)} />;
  }

  return <Dashboard onEnterForum={setSelectedForum} />;
}

export default App;
