import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "@/api/auth.ts";
import {toast} from "sonner";

type User = { id: number; name: string; email: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredToken(): string | null {
  return localStorage.getItem("auth_token");
}

function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredToken();
    if (!stored) {
      setIsLoading(false);
      return;
    }
    getCurrentUser()
      .then((u) => {
        setUser(u);
        setToken(stored);
      })
      .catch(() => {
        setStoredToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const result = await loginUser(email, password);
    setStoredToken(result.token);
    setToken(result.token);
    setUser(result.user);
    toast('Logged in successfully!');
    return result.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<User> => {
    const result = await registerUser(
      name,
      email,
      password,
      passwordConfirmation
    );
    setStoredToken(result.token);
    setToken(result.token);
    setUser(result.user);
    toast('Registered successfully!');
    return result.user;
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch {
      // Even if the API call fails, clear local state
    }
    setStoredToken(null);
    setToken(null);
    setUser(null);
    toast('Logged out successfully!');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
