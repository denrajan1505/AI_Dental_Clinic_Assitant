import ChatWidget from "@/components/chat/ChatWidget";

export default function ChatPanel({
  autoSendMessage,
  onClose,
}: {
  autoSendMessage?: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-lg">
      <ChatWidget autoSendMessage={autoSendMessage} onClose={onClose} />
    </div>
  );
}
