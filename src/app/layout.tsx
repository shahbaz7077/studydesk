import type { Metadata } from "next";
import { AppProvider } from "@/context/AppProvider";
import { ToastProvider } from "@/context/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyDesk",
  description: "A simple workspace for your study material.",
};

// Runs before first paint so the saved theme does not flash.
const themeScript = `
try {
  if (localStorage.getItem("studydesk_theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
