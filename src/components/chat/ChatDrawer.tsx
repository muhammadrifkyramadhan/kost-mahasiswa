import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Users, 
  Send, 
  Package, 
  Bell, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatDrawer: React.FC = () => {
  const {
    currentUser,
    chatDrawerOpen,
    setChatDrawerOpen,
    chatTab,
    setChatTab,
    communityMessages,
    directMessages,
    sendCommunityMessage,
    sendDirectMessage,
  } = useApp();

  const [inputDirect, setInputDirect] = useState('');
  const [inputCommunity, setInputCommunity] = useState('');
  const [selectedTag, setSelectedTag] = useState<'umum' | 'kiriman_paket' | 'tanya' | 'pengumuman'>('umum');

  const scrollRefDirect = useRef<HTMLDivElement>(null);
  const scrollRefCommunity = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatTab === 'direct') {
      scrollRefDirect.current?.scrollTo({ top: scrollRefDirect.current.scrollHeight, behavior: 'smooth' });
    } else {
      scrollRefCommunity.current?.scrollTo({ top: scrollRefCommunity.current.scrollHeight, behavior: 'smooth' });
    }
  }, [communityMessages, directMessages, chatTab, chatDrawerOpen]);

  if (!chatDrawerOpen) return null;

  const handleSendDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDirect.trim()) return;
    sendDirectMessage(inputDirect.trim());
    setInputDirect('');
  };

  const handleSendCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommunity.trim()) return;
    sendCommunityMessage(inputCommunity.trim(), selectedTag);
    setInputCommunity('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Pusat Komunikasi Kos</h3>
              <p className="text-[11px] text-slate-500">Pesan langsung & obrolan penghuni</p>
            </div>
          </div>
          <button
            onClick={() => setChatDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="p-2 bg-slate-100 flex items-center gap-1 mx-3 mt-3 rounded-2xl">
          <button
            type="button"
            onClick={() => setChatTab('direct')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              chatTab === 'direct'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pesan ke Pemilik</span>
          </button>

          <button
            type="button"
            onClick={() => setChatTab('community')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              chatTab === 'community'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Grup Lorong Kost</span>
          </button>
        </div>

        {/* Chat Body */}
        {chatTab === 'direct' ? (
          /* DIRECT CHAT WITH OWNER */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Owner banner */}
            <div className="px-4 py-2.5 bg-emerald-50/60 border-b border-emerald-100/80 flex items-center gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex-1">
                <span className="font-bold text-emerald-950">Hj. Endang Suryaningsih (Owner Kost)</span>
                <p className="text-[10px] text-emerald-700">Online • Rata-rata membalas dalam 5 menit</p>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div ref={scrollRefDirect} className="flex-1 overflow-y-auto p-4 space-y-3">
              {directMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Input */}
            <form onSubmit={handleSendDirect} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputDirect}
                onChange={(e) => setInputDirect(e.target.value)}
                placeholder="Tulis pesan ke Ibu Kost..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputDirect.trim()}
                className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* COMMUNITY BOARD & TENANT GROUP */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Tag filter selector */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="font-bold text-slate-400 uppercase text-[10px] shrink-0">Kategori:</span>
              {(['umum', 'kiriman_paket', 'pengumuman', 'tanya'] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition-all ${
                    selectedTag === tag
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {tag === 'kiriman_paket' ? '📦 Paket' : tag === 'pengumuman' ? '📢 Pengumuman' : tag === 'tanya' ? '❓ Tanya' : '💬 Umum'}
                </button>
              ))}
            </div>

            {/* Community Messages */}
            <div ref={scrollRefCommunity} className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {communityMessages.map((cmsg) => {
                const isMe = cmsg.senderId === currentUser.id;
                return (
                  <div key={cmsg.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={cmsg.senderAvatar}
                      alt={cmsg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-slate-900 truncate text-[11px]">{cmsg.senderName}</span>
                        <span className="text-[10px] text-slate-400">{cmsg.timestamp}</span>
                      </div>

                      {cmsg.tag && (
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider mb-1 mt-0.5 ${
                          cmsg.tag === 'pengumuman' ? 'bg-amber-100 text-amber-800' :
                          cmsg.tag === 'kiriman_paket' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {cmsg.tag.replace('_', ' ')}
                        </span>
                      )}

                      <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl rounded-tl-xs text-slate-700 leading-relaxed shadow-2xs">
                        {cmsg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Community Input */}
            <form onSubmit={handleSendCommunity} className="p-3 border-t border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputCommunity}
                  onChange={(e) => setInputCommunity(e.target.value)}
                  placeholder={`Kirim ke grup penghuni (Kategori: ${selectedTag})...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!inputCommunity.trim()}
                  className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
