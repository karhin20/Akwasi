import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bot, X, Send, Sparkles } from 'lucide-react';
import { chat as chatApi } from '../lib/api';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface ConversationTurn {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

// FormattedText component to render bold tokens (**text**), bullet items (- item), and paragraphs cleanly
const FormattedText: React.FC<{ text: string; isUser?: boolean }> = ({ text, isUser }) => {
  const lines = text.split('\n');

  return (
    <div className={`space-y-1 text-xs leading-relaxed ${isUser ? 'text-white' : 'text-slate-800'}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-0.5" />;

        // Check if bullet item
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ');
        const content = isBullet ? trimmed.substring(2).trim() : trimmed;

        // Parse **bold** markdown tokens
        const parts = content.split(/(\*\*.*?\*\*)/g);
        const renderedParts = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong
                key={partIdx}
                className={isUser ? 'font-black text-white' : 'font-extrabold text-slate-900'}
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className={`font-bold text-xs shrink-0 ${isUser ? 'text-white' : 'text-[#ea580c]'}`}>
                •
              </span>
              <span>{renderedParts}</span>
            </div>
          );
        }

        return <p key={lineIdx}>{renderedParts}</p>;
      })}
    </div>
  );
};

interface EnquiryChatWidgetProps {
  onOpenListing?: (id: string) => void;
}

export const EnquiryChatWidget: React.FC<EnquiryChatWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! 👋 Welcome to our Heavy Equipment, Vehicles & Property Marketplace. How can I assist you today?',
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Tracks the conversation history for Gemini multi-turn context
  const historyRef = useRef<ConversationTurn[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = inputMessage.trim();
    if (!userText || isTyping) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message to UI
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: currentTime },
    ]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send to backend → Gemini
      const { reply } = await chatApi.send(userText, historyRef.current);

      // Update conversation history for next turn
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: reply }] },
      ];

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm temporarily unavailable. Please contact us on WhatsApp: +233 24 123 4567 for immediate help.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAsk = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all transform animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#f97316] flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-snug">Digital Assistant</h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  24/7 Online Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close widget"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Chatbot Content */}
          <div className="flex flex-col h-[400px]">
            {/* Quick AI Suggestion Chips */}
            <div className="p-2 bg-slate-100/90 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <span className="font-bold text-slate-500 uppercase text-[9px] shrink-0 pl-1">Quick Ask:</span>
              <button
                type="button"
                onClick={() => handleQuickAsk('What is the price and inspection schedule for the Caterpillar 320 Excavator?')}
                className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md border border-slate-200 shrink-0 cursor-pointer font-medium"
              >
                Excavator Price &amp; Inspection
              </button>
              <button
                type="button"
                onClick={() => handleQuickAsk('What properties do you have for sale in Accra under GHS 5 million?')}
                className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md border border-slate-200 shrink-0 cursor-pointer font-medium"
              >
                Properties in Accra
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-xl shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#f97316] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <FormattedText text={msg.text} isUser={msg.sender === 'user'} />

                    {msg.sender === 'bot' && idx > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">Need immediate help?</span>
                        <a
                          href={`https://wa.me/233241234567?text=${encodeURIComponent(
                            `Hello, I asked the AI Assistant: "${chatMessages[idx - 1]?.text || 'General Query'}"`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp Support</span>
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none p-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-2.5 bg-white border-t border-slate-200 space-y-2">
              <form onSubmit={handleSendMessage} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Ask AI about machinery, specs, prices..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isTyping}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-slate-900 hover:bg-[#f97316] text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Hover Button */}
      <div className="relative group">
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Digital Assistant</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-slate-900 hover:bg-[#f97316] text-white w-13 h-13 rounded-full shadow-2xl flex items-center justify-center border-2 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
          aria-label="Digital Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-6" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full animate-ping" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
