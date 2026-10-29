import { ChatView } from "@/components/chat/ChatView";

interface ChatPageProps {
  searchParams: { id?: string; subject?: string; new?: string };
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  const { id, subject, new: fresh } = searchParams;
  // The key remounts the session whenever the URL points to a different chat.
  return <ChatView key={`${id}|${subject}|${fresh}`} chatId={id} subjectId={subject} />;
}
