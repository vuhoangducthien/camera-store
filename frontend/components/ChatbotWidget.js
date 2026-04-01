import { useEffect, useMemo, useRef, useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';

export default function ChatbotWidget() {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Xin chào! Mình là Camera Advisor. Bạn đang cần tư vấn quay video hay chụp ảnh?',
    },
  ]);
  const listRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    const myMsg = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev, myMsg]);
    setMessage('');

    try {
      setSending(true);
      const res = await axios.post('/ai/chatbot', { message: text });
      const botMsg = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: res.data?.reply || 'Mình chưa hiểu ý bạn. Bạn có thể nói rõ hơn chút được không?',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn');
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: 'Hiện tại mình đang bận một chút. Bạn thử lại sau nhé.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const canSend = useMemo(() => message.trim().length > 0 && !sending, [message, sending]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {open && (
        <div className="mb-4 w-[360px] max-w-[calc(100vw-2.5rem)] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-2xl shadow-gray-900/10">
          <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-white/80">Camera Advisor</div>
                <div className="text-base font-black tracking-tight truncate">Chat tư vấn nhanh</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                aria-label="Đóng chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={listRef} className="h-[360px] overflow-y-auto px-4 py-4 bg-gray-50/40">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md shadow-lg shadow-blue-600/20'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm font-medium">
                    Đang trả lời...
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                  onFocus={() => setOpen(true)}
                />
              </div>
              <button
                type="submit"
                disabled={!canSend}
                className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Gửi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-6 9 6-9 6-9-6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9 6 9-6" />
                </svg>
              </button>
            </div>
            <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-gray-300">
              Gợi ý: vlog • chụp ảnh • chuyên nghiệp • giá rẻ
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-[1.3rem] bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center"
        aria-label="Mở chat"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8m-8 4h5m9 1a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}
