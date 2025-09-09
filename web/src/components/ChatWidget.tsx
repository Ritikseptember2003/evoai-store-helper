import { ShoppingCart } from 'lucide-react';
import { useChatController } from '../hooks/useChatController';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

export const ChatWidget = () => {
  const { messages, cartCount, isTyping, handleSendMessage } = useChatController();

  return (
    <div className="chat-widget-container">
      <div className="chat-widget-header">
        <h3>EvoAI Store Helper</h3>
        <div className="cart-badge">
          <ShoppingCart size={16} style={{ marginRight: '4px' }}/> {cartCount}
        </div>
      </div>
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};