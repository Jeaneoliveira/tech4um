import { useState } from "react";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/Chat";

type Forum = {
  id: number;
  name: string;
  description?: string;
  created_by: number;
};

function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);

  if (!isLogged) {
    return <Login onLogin={() => setIsLogged(true)} />;
  }

  if (selectedForum) {
    return <Chat forum={selectedForum} onBack={() => setSelectedForum(null)} />;
  }

  return <Dashboard onEnterForum={(forum) => setSelectedForum(forum)} />;
}

export default App;