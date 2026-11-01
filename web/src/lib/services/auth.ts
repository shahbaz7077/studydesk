import { api, clearToken, setToken, type ApiUser } from "@/lib/api";

interface AuthResponse {
  user: ApiUser;
  token: string;
}

export const authService = {
  async login(email: string, password: string) {
    const res = await api<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    return res.user;
  },
  async register(name: string, email: string, password: string) {
    const res = await api<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setToken(res.token);
    return res.user;
  },
  logout() {
    clearToken();
    try {
      // is user ka local data (chats waghera) hata do, theme rehne do
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith("studydesk_") && k !== "studydesk_theme")
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // ignore
    }
    window.location.href = "/login";
  },
};