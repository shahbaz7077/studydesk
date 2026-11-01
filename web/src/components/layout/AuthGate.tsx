"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getToken } from "@/lib/api";

// Token na ho to /login par bhej do.
export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/login");
    else setOk(true);
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}