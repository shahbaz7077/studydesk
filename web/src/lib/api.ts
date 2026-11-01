// Laravel API ka chhota client: token lagata hai, errors saaf karta hai.
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001/api";
const TOKEN_KEY = "studydesk_token";

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage blocked: ignore
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "Server se connect nahi ho paya. Laravel chal raha hai?");
  }

  // Token expire/ghalat ho gaya: dobara login
  if (res.status === 401 && token) {
    clearToken();
    window.location.href = "/login";
    throw new ApiError(401, "Session expire ho gaya. Dobara login karo.");
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? `Request failed (${res.status})`);
  }
  return data as T;
}

// --- API response shapes (Laravel se jo aata hai) ---
export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export interface ApiSubject {
  id: number;
  name: string;
  description: string | null;
  tone: string;
  icon: string;
}

export interface ApiDocument {
  id: number;
  subject_id: number | null;
  title: string;
  status: "pending" | "processing" | "ready" | "failed";
  error: string | null;
  created_at: string;
}