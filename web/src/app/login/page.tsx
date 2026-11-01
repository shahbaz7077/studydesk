"use client";

import { useState, type FormEvent } from "react";
import { authService } from "@/lib/services/auth";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await authService.login(email, password);
      else await authService.register(name, email, password);
      // Poora reload: AppProvider naye token ke saath data load karega.
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch galat ho gaya.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-6">
        <h1 className="text-lg font-semibold">
          {mode === "login" ? "StudyDesk mein login" : "Naya account banao"}
        </h1>

        {mode === "register" && (
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password (kam az kam 8 characters)
          </label>
          <input
            id="password"
            type="password"
            className="input"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Wait…" : mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          className="w-full text-center text-sm text-slate-500 hover:underline"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "Account nahi hai? Register karo" : "Pehle se account hai? Login karo"}
        </button>
      </form>
    </div>
  );
}