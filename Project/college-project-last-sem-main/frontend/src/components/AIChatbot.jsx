import { useState, useRef, useEffect } from 'react'
import { FiMessageSquare, FiX, FiSend, FiMinus } from 'react-icons/fi'
import { MdLocalPharmacy } from 'react-icons/md'
import { chatAPI } from '../api'

export default function AIChatbot() {
  const [open,       setOpen]    = useState(false)
  const [minimized,  setMin]     = useState(false)
  const [enabled,    setEnabled] = useState(true)
  const [messages,   setMessages]= useState([
    { role: 'assistant', content: 'Hi! I\'m MediBot 🤖 Your AI health assistant. I can help you with medicine info, dosage guidance, health tips, and finding the right products. How can I help you today?' }
  ])
  const [input,    setInput]     = useState('')
  const [loading,  setLoading]   = useState(false)
  const bottomRef                = useRef(null)

  useEffect(() => {
    fetch('/api/chat/status')
      .then(r => r.json())
      .then(d => setEnabled(d.enabled))
      .catch(() => setEnabled(true))
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  if (!enabled) return null;

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

    if (!apiKey || apiKey.includes('YOUR_ANTHROPIC_KEY') || apiKey.includes('your_anthropic_api_key_here')) {
      try {
        const res = await chatAPI.sendMessage(userMsg)
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }])
      } catch (err) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm having trouble connecting to my local brain right now. Please try again later! 🙏"
        }])
      } finally { setLoading(false) }
      return
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          system: `You are MediBot, a helpful AI assistant for MediMart, an online pharmacy in India. 
You help users with:
- General medicine information (uses, dosage, side effects - always recommend consulting a doctor)
- Health tips and wellness advice  
- Finding medicines on MediMart (suggest searching in the Medicines section)
- Understanding prescriptions (always recommend doctor consultation)
- Order and delivery queries (tell them to check Orders section)
Keep responses concise, friendly, and always add a disclaimer to consult a healthcare professional for medical advice.
Never diagnose conditions. Always suggest professional consultation for serious health concerns.`,
          messages: [
            ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: userMsg }
          ]
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      const reply = data.content?.[0]?.text || "I'm sorry, I couldn't process that. Please try again."
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your API key and try again! 🙏"
      }])
    } finally { setLoading(false) }
  }

  return (
    <>
      {/* FAB */}
      <button onClick={() => { setOpen(true); setMin(false) }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <FiMessageSquare className="text-2xl"/>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"/>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'} ${minimized ? 'h-14 overflow-hidden' : 'h-[480px]'}`}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-t-2xl">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <MdLocalPharmacy className="text-lg"/>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">MediBot</p>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"/>
              <span className="text-xs opacity-80">Online</span>
            </div>
          </div>
          <button onClick={() => setMin(!minimized)} className="p-1 hover:bg-white/20 rounded-lg transition">
            <FiMinus/>
          </button>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
            <FiX/>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="chat-bubble-bot flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1">
            {['Dosage of Dolo 650?', 'Side effects of Azithromycin?', 'Vitamins for immunity'].map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(()=>document.getElementById('chat-input')?.focus(),50) }}
                className="text-xs bg-primary-50 text-primary-700 border border-primary-200 px-2.5 py-1 rounded-full hover:bg-primary-100 transition">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <input id="chat-input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about medicines…"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"/>
          <button onClick={send} disabled={loading || !input.trim()}
            className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl transition">
            <FiSend className="text-sm"/>
          </button>
        </div>
      </div>
    </>
  )
}
