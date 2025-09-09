import { useEffect, useRef } from "react";
import { Message } from "../hooks/useChatController";
import { ChatBubble } from "./ChatBubble";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatMessages = ({ messages, isTyping }: ChatMessagesProps) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      {isTyping && <div className="chat-bubble bot">Thinking...</div>}
      <div ref={endOfMessagesRef} />
    </div>
  );
};