import { ChatBot } from "@/components/chat-bot";

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-muted-foreground">
          Get instant help with disaster management questions and guidance
        </p>
      </div>
      <ChatBot />
    </div>
  );
}
