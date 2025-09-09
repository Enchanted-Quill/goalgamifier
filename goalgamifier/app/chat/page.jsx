'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const fetchSlots = async () => {
      const res = await axios.get('/api/conversation_list', { params: { uid: user.uid } });
      setConversations(res.data);
      if (res.data.length > 0) setActiveSlot(res.data[0].slotId);
    };
    fetchSlots();
  }, [user]);

  useEffect(() => {
    if (!user || !activeSlot) return;
    const fetchMessages = async () => {
      const res = await axios.get('/api/conversation_get', { params: { uid: user.uid, slotId: activeSlot } });
      setMessages(res.data?.messages ?? []);
    };
    fetchMessages();
  }, [user, activeSlot]);

  const newConversation = async () => {
    const res = await axios.post('/api/conversation_new', { uid: user.uid });
    setConversations((prev) => [res.data, ...prev]);
    setActiveSlot(res.data.slotId);
    setMessages([]);
  };

  const sendQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || !user || !activeSlot) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post('/api/groq', { message: query });
      const botMessage = { sender: 'bot', text: res.data.reply };

      await axios.post('/api/conversation_post', {
        uid: user.uid,
        slotId: activeSlot,
        userMessage: query,
        botMessage: res.data.reply,
      });

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Error fetching/saving conversation.' },
      ]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#001935] to-[#001245] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-100 to-gray-300 p-4 shadow-lg">
        <button
          onClick={newConversation}
          className="mb-4 w-full py-3 rounded-2xl text-lg font-semibold bg-gradient-to-b from-teal-400 to-teal-700 text-white shadow-lg hover:scale-105 transition-transform"
        >
          + New Chat
        </button>
        {conversations.map((c) => (
          <div
            key={c._id.toString()}
            onClick={() => setActiveSlot(c.slotId)}
            className={`p-3 rounded-xl cursor-pointer mb-3 transition-transform hover:scale-105 shadow-md font-sans ${
              activeSlot === c.slotId
                ? 'bg-gradient-to-b from-[#A8D4FF] to-[#6EB7FF] text-black'
                : 'bg-gradient-to-b from-gray-200 to-gray-400 text-gray-900'
            }`}
          >
            {c.name || `Conversation ${c.slotId}`}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-2 text-center drop-shadow-md text-white">Goal Idea Generator</h1>
        {user && <p className="mb-4 text-center text-white">Welcome, <strong>{user.email}</strong>!</p>}

        {/* Messages */}
        <div className="flex-1 mb-4 overflow-y-auto p-4">
          {messages.length === 0 && <p className="text-center text-gray-300">Start chatting...</p>}
          {messages.map((msg, i) => (
            <pre
              key={i}
              className={`whitespace-pre-wrap mb-2 p-3 rounded-xl shadow-md font-sans ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-b from-[#A8D4FF] to-[#6EB7FF] text-black'
                  : 'bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900'
              }`}
            >
              <strong>{msg.sender === 'user' ? 'You' : 'GROQ Bot'}:</strong> {msg.text}
            </pre>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={sendQuery} className="flex space-x-3">
          <input
            type="text"
            placeholder="Describe yourself or your goals"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-4 py-3 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-300 placeholder-gray-500 text-gray-800 shadow-inner focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl text-lg font-semibold bg-gradient-to-b from-teal-400 to-teal-700 text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
