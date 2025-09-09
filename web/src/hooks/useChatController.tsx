import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';

const API_BASE_URL = 'https://evoai-store-helper-api.onrender.com';

export interface Message {
  id: number;
  sender: 'user' | 'bot';
  content: string | JSX.Element;
}

export const useChatController = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', content: "Hello! How can I help? You can search products, add to cart, or track an order." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const addMessage = (sender: 'user' | 'bot', content: string | JSX.Element) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, content }]);
  };

  const handleSendMessage = async (text: string) => {
    addMessage('user', text);
    setIsTyping(true);

    // --- Intent Parsing ---
    const lowerText = text.toLowerCase();

    // 1. Search Intent
    if (lowerText.startsWith('search') || lowerText.startsWith('find') || lowerText.startsWith('looking for')) {
      const query = lowerText.replace(/^(search|find|looking for)\s*/, '');
      try {
        const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.length > 0) {
          const productCards = (
            <div>
              <p>{`Here's what I found for "${query}":`}</p>
              {data.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          );
          addMessage('bot', productCards);
        } else {
          addMessage('bot', `Sorry, I couldn't find any products matching "${query}".`);
        }
      } catch (error) {
        addMessage('bot', 'Oops! There was an error searching. Please try again.');
      }

      // 2. Add to Cart Intent
    } else if (lowerText.match(/add (p\d+) x(\d+)/)) {
      const [, productId, qtyStr] = lowerText.match(/add (p\d+) x(\d+)/)!;
      try {
        const res = await fetch(`${API_BASE_URL}/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, qty: parseInt(qtyStr) })
        });
        const data = await res.json();
        if (res.ok) {
          setCartCount(data.totalItems);
          addMessage('bot', `Added! Your cart now has ${data.totalItems} item(s).`);
        } else {
          addMessage('bot', `Error: ${data.error || 'Could not add item.'}`);
        }
      } catch (error) {
        addMessage('bot', 'Oops! Could not add to cart. Please try again.');
      }

      // 3. Order Status Intent
    } else if (lowerText.startsWith('track') || lowerText.startsWith('check order')) {
      const orderIdMatch = lowerText.match(/ORD-\d{4}/i);
      const emailMatch = lowerText.match(/[\w.-]+@[\w.-]+\.\w+/);

      if (orderIdMatch && emailMatch) {
        const orderId = orderIdMatch[0].toUpperCase(); 
        const email = emailMatch[0];

        try {
          const res = await fetch(`${API_BASE_URL}/order/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, email })
          });
          const data = await res.json();
          if (res.ok) {
            addMessage('bot', `Order ${data.orderId} Status: **${data.status}**. ETA: ${data.eta}.`);
          } else {
            addMessage('bot', `Error: ${data.error || 'Could not find order.'}`);
          }
        } catch (error) {
          addMessage('bot', 'Oops! There was an error checking the order. Please try again.');
        }
      } else {
        addMessage('bot', "To track an order, please provide the Order ID and your email. Ex: 'track ORD-1001 for alice@example.com'");
      }
    }
    else {
      addMessage('bot', "I'm not sure how to help with that. Try 'search for...', 'add p1 x1', or 'track order ORD-1234 for user@email.com'.");
    }

    setIsTyping(false);
  };

  return { messages, cartCount, isTyping, handleSendMessage };
};