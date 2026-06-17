'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';

// Defined types for messages
type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: string[];
};

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Greetings. I am here to guide you with Ayurvedic wisdom. What would you like to ask today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.answer || data.response || data.message || 'No response provided.',
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Failed to fetch from API:', err);
      setError('The wisdom of the cosmos is currently unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-[73px]">
      <Header />
      
      <main className="flex-grow flex flex-col max-w-4xl w-full mx-auto p-4 md:p-8 h-[calc(100vh-73px)] relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl md:text-5xl text-surface-cream mb-2">
            Ask <span className="text-resonant-pink">AI</span>
          </h1>
          <p className="text-surface-cream/70 font-body-md">Seek guidance aligned with your cosmic rhythm.</p>
        </div>

        {/* Chat Area */}
        <div className="flex-grow bg-forest-ink/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
          
          {/* Messages Scroll Area */}
          <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-resonant-pink text-forest-ink rounded-br-sm shadow-[0_0_15px_rgba(192,96,128,0.3)]' 
                      : 'bg-white/5 border border-white/10 text-surface-cream rounded-bl-sm'
                  }`}
                >
                  <p className="font-body-md whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  
                  {/* Sources display for AI */}
                  {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-xs text-surface-cream/50 uppercase tracking-widest font-label-caps">
                        Sources: {msg.sources.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm p-4 text-surface-cream flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-resonant-pink"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-resonant-pink"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-resonant-pink"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="font-body-md text-sm text-surface-cream/70 ml-2">Channeling wisdom...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex justify-center w-full my-2">
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-body-md text-center max-w-md">
                  {error}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-forest-ink/80 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a wellness question..."
                disabled={isLoading}
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-surface-cream font-body-md focus:outline-none focus:border-resonant-pink/50 focus:bg-white/10 transition-all placeholder:text-surface-cream/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-resonant-pink text-forest-ink px-6 rounded-xl font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(192,96,128,0.2)] flex items-center justify-center min-w-[100px]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
