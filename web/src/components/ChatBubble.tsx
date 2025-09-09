import { Message } from "../hooks/useChatController";

export const ChatBubble = ({ message }: { message: Message }) => {
  return (
    <div className={`chat-bubble ${message.sender}`}>
      {typeof message.content === 'string' ? <p>{message.content}</p> : message.content}
    </div>
  );
};