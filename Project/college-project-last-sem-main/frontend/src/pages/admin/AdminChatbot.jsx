import { useState, useEffect } from 'react'
import api, { chatAPI } from '../../api'
import { FiMessageSquare } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

export default function AdminChatbot() {
  const [history, setHistory] = useState([])
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState(null)

  const fetchData = async () => {
    try {
      const [histRes, statusRes] = await Promise.all([
        chatAPI.adminGetAll(),
        api.get('/chat/status')
      ])
      setHistory(histRes.data || [])
      setEnabled(statusRes.data.enabled)
    } catch (err) {
      toast.error('Failed to load chatbot data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleToggle = async () => {
    try {
      await api.post('/admin/chat/status', { enabled: !enabled })
      setEnabled(!enabled)
      toast.success(`Chatbot ${!enabled ? 'enabled' : 'disabled'}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading chatbot management...</div>

  return (
    <div className="page-transition p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Chatbot Management</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Monitor and configure AI assistant</p>
        </div>
        
        <div className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${enabled ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
          <div className="text-right">
            <p className={`text-xs font-black uppercase tracking-widest ${enabled ? 'text-emerald-600' : 'text-rose-600'}`}>
              Status: {enabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <button 
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="card-premium p-6 flex items-center gap-4 w-fit mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl">
          <FiMessageSquare />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Total Queries</p>
          <p className="text-2xl font-black text-slate-900">{history.length}</p>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 font-bold text-slate-600">Chat ID</th>
                <th className="p-4 font-bold text-slate-600">Customer Login ID</th>
                <th className="p-4 font-bold text-slate-600">Question</th>
                <th className="p-4 font-bold text-slate-600">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map(item => (
                <tr
                  key={item.chatId}
                  className="hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === item.chatId ? null : item.chatId)}
                >
                  <td className="p-4 text-sm font-medium text-slate-500">#{item.chatId}</td>
                  <td className="p-4 font-bold text-slate-800">{item.cFullname || 'Anonymous'}</td>
                  <td className="p-4 text-sm text-slate-700 font-medium">{item.question}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className={expandedRow === item.chatId ? '' : 'truncate max-w-xs'}>
                      {item.response}
                    </div>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No chat history yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
