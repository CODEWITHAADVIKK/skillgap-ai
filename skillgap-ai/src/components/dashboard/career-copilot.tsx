"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your Career Copilot. Ask me about your resume, skill gaps, roadmap, or interview prep.",
};

export function CareerCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(event?: React.FormEvent) {
    event?.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = (await response.json()) as { message?: string; reply?: string };
      const reply = data.message ?? data.reply ?? "Sorry, I couldn't generate a response.";

      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen ? (
        <div className="flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </div>
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">
                  Career Copilot
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  AI career assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 font-body-md text-body-md",
                  message.role === "user"
                    ? "ml-auto bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface"
                )}
              >
                {message.content}
              </div>
            ))}
            {isLoading ? (
              <div className="max-w-[85%] rounded-2xl bg-surface-container-low px-3 py-2 font-body-md text-body-md text-on-surface-variant">
                Thinking...
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-outline-variant/20 px-4 py-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your career..."
              className="flex-1 rounded-xl border border-outline-variant/30 bg-white px-3 py-2 font-body-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      ) : null}

      <Button
        type="button"
        size="lg"
        className="rounded-full px-5 shadow-lg"
        onClick={() => setIsOpen((open) => !open)}
      >
        <MessageCircle className="size-5" />
        Career Copilot
      </Button>
    </div>
  );
}
