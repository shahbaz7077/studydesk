"use client";

import { LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authService } from "@/lib/services/auth";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/subjects": "Subjects",
  "/library": "Documents",
  "/chat": "Chat",
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "StudyDesk";

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
      >
        <Menu size={18} />
      </button>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</span>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <button
          onClick={() => authService.logout()}
          aria-label="Log out"
          title="Log out"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}