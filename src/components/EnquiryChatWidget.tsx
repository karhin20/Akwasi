import React, { useState } from 'react';
import { MessageSquare, Bot, X, Send, Sparkles, CheckCircle2, Phone, Mail, User, HelpCircle } from 'lucide-react';

interface EnquiryChatWidgetProps {
  onOpenListing?: (id: string) => void;
}

export const EnquiryChatWidget: React.FC<EnquiryChatWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! 👋 Welcome to our Heavy Equipment, Vehicles & Property Marketplace. How can I assist you today?',
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: userText, time: currentTime }
    ];
    setChatMessages(newMessages);
    setInputMessage('');

    // Simulate smart automated chatbot response
    setTimeout(() => {
      let botResponse = "Thank you for reaching out! You can also chat directly with our sales team on WhatsApp for immediate help.";
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('quote')) {
        botResponse = "For detailed pricing or custom volume quotes on heavy machinery and fleet vehicles, please tap the WhatsApp Support button or call our sales line directly at +233 24 123 4567.";
      } else if (lower.includes('excavator') || lower.includes('machinery') || lower.includes('cat') || lower.includes('komatsu')) {
        botResponse = "We have certified hydraulic excavators, bulldozers, and wheel loaders available for sale and rental in Greater Accra and Western region.";
      } else if (lower.includes('inspect') || lower.includes('location') || lower.includes('viewing')) {
        botResponse = "Physical inspection for heavy equipment and commercial properties can be arranged Monday to Saturday, 8:00 AM – 5:00 PM.";
      } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call')) {
        botResponse = "You can contact our support desk directly via Phone/WhatsApp: +233 24 123 4567.";
      }

      setChatMessages(prev => [
        ...prev,
        { sender: 'bot', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 800);
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
                <h3 className="font-bold text-sm leading-snug">AI Assistant &amp; WhatsApp</h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online Assistant
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
                onClick={() => {
                  setInputMessage("What is the price and inspection schedule for the Caterpillar 320 Excavator?");
                }}
                className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md border border-slate-200 shrink-0 cursor-pointer font-medium"
              >
                Excavator Price &amp; Inspection
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMessage("Is the MAN Tipper Truck available for test drive in Kasoa?");
                }}
                className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md border border-slate-200 shrink-0 cursor-pointer font-medium"
              >
                MAN Tipper Availability
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
                    <p className="leading-relaxed">{msg.text}</p>
                    
                    {msg.sender === 'bot' && idx > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">Need immediate assistance?</span>
                        <a
                          href={`https://wa.me/233241234567?text=${encodeURIComponent(
                            `Hello, I am asking the AI Assistant: "${chatMessages[idx - 1]?.text || 'General Query'}"`
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
            </div>

            {/* Chat Input & WhatsApp Quick Action Bar */}
            <div className="p-2.5 bg-white border-t border-slate-200 space-y-2">
              <form onSubmit={handleSendMessage} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Ask AI about machinery, specs, prices..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-[#f97316] text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <a
                href="https://wa.me/233241234567?text=Hello%20AkwasiJob%20Team,%20I%20have%20an%20enquiry%20regarding%20an%20equipment/property%20listing."
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline py-0.5"
              >
                💬 Or send direct WhatsApp message (+233 24 123 4567)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Hover Button */}
      <div className="relative group">
        {/* Tooltip on hover */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Assistant &amp; WhatsApp</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-slate-900 hover:bg-[#f97316] text-white w-13 h-13 rounded-full shadow-2xl flex items-center justify-center border-2 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
          aria-label="AI Assistant and WhatsApp"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-6" />
              {/* Pulsing indicator dot */}
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full animate-ping" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
