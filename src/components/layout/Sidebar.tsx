"use client";

import { BookOpen, FileText, LayoutDashboard, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/library", label: "Documents", icon: FileText },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { documents, chats } = useApp();

  const recent = [...chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 7);

  function newChat() {
    onClose();
    router.push(`/chat?new=${Date.now()}`);
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-slate-200 bg-white px-3 py-5 transition-transform dark:border-slate-800 dark:bg-slate-900",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <Link href="/" onClick={onClose} className="mb-6 px-2 text-lg font-semibold">
        StudyDesk
      </Link>

      <button onClick={newChat} className="btn-primary mb-5 w-full justify-start">
        <Plus size={16} /> New chat
      </button>

      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60",
              )}
            >
              <Icon size={16} />
              {label}
              {href === "/library" && (
                <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800">
                  {documents.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <p className="mb-2 mt-6 px-3 text-xs font-medium uppercase tracking-wide text-slate-400">
        Recent chats
      </p>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
        {recent.length === 0 ? (
          <p className="px-3 text-sm text-slate-400">No chats yet.</p>
        ) : (
          recent.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat?id=${chat.id}`}
              onClick={onClose}
              className="flex items-center gap-2 truncate rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60"
            >
              <MessageSquare size={14} className="shrink-0" />
              <span className="truncate">{chat.title}</span>
            </Link>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 px-2 pt-4 text-xs text-slate-400 dark:border-slate-800">
        Data is saved in this browser.
      </div>
    </aside>
  );
}
