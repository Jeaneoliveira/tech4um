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
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const isLogged = !!localStorage.getItem("token");

  if (showLogin) {
    return (
      <Login
        onLogin={() => {
          setShowLogin(false);
        }}
      />
    );
  }

  if (selectedForum) {
    return (
      <Chat
        forum={selectedForum}
        onBack={() => setSelectedForum(null)}
      />
    );
  }

  return (
    <Dashboard
      onEnterForum={(forum) => {
        if (!isLogged) {
          setShowLogin(true);
          return;
        }

        setSelectedForum(forum);
      }}
    />
  );
}

export default App;