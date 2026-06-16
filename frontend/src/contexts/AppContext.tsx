import {
    createContext,
    useContext,
    useState,
    useEffect,
  } from "react";
  import type { ReactNode } from "react";
  import { io, Socket } from "socket.io-client";
    
  export type User = {
    id: number;
    username: string;
    email: string;
  };
  
  export type Forum = {
    id: number;
    name: string;
    description?: string;
    created_by?: number;
  };
  
  type AppContextType = {
    // Auth (antes no AuthContext)
    user: User | null;
    token: string | null;
    isLogged: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
  
    selectedForum: Forum | null;
    setSelectedForum: (forum: Forum | null) => void;
  
    socket: Socket;
  };
    
  const socket = io("http://localhost:3000", {
    autoConnect: false, // conecta só depois do login
  });
    
  const AppContext = createContext<AppContextType | null>(null);
  
  export function AppProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
      () => localStorage.getItem("token")
    );
  
    const [user, setUser] = useState<User | null>(() => {
      const stored = localStorage.getItem("user");
      return stored ? (JSON.parse(stored) as User) : null;
    });
  
    const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  
    useEffect(() => {
      if (token) {
        socket.connect();
      } else {
        socket.disconnect();
      }
    }, [token]);
  
    function login(newToken: string, newUser: User) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    }
  
    function logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setSelectedForum(null);
    }
  
    return (
      <AppContext.Provider
        value={{
          user,
          token,
          isLogged: !!token,
          login,
          logout,
          selectedForum,
          setSelectedForum,
          socket,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }
    
  export function useAppContext(): AppContextType {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useAppContext deve ser usado dentro de AppProvider");
    }
    return context;
  }
  
  export const useAuth = useAppContext;
  