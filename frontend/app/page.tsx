import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-black">
      <ChatWidget />
    </div>
  );
}
