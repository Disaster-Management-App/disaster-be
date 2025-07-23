"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { ChatBot } from "./chat-bot";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh]">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
}
