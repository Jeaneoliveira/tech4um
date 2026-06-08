import { useState } from "react";
import { Login } from "./pages/Login";
import { ChatTest } from "./pages/ChatTest";

function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));

  return isLogged ? <ChatTest /> : <Login onLogin={() => setIsLogged(true)} />;
}

export default App;