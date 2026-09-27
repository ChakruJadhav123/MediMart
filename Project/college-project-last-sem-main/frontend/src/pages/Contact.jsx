import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const contacts = [
    { icon: FiPhone, label: 'Phone', value: '+91 7219467259', sub: 'Mon-Sat, 9am–6pm' },
    { icon: FiMail, label: 'Email', value: 'support@medimart.com', sub: 'We reply within 24hrs' },
    { icon: FiMapPin, label: 'Address', value: 'SIOM,Vadgaon, Pune, Maharashtra 411001', sub: 'Visit us anytime' },
    { icon: FiClock, label: 'Hours', value: 'Mon–Sat: 9am – 8pm', sub: 'Sun: 10am – 4pm' },
  ]

  return (
    <div className="page-enter">
      <section className="bg-gradient-to-br from-primary-700 to-teal-600 text-white py-16 text-center px-4">
        <h1 className="text-4xl font-extrabold mb-3">Contact Us</h1>
        <p className="text-white/80 text-lg">We're here to help. Reach out anytime!</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
        {/* Info cards */}
        <div className="space-y-4">
          {contacts.map(c => (
            <div key={c.label} className="card p-5 flex gap-4 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                <c.icon />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{c.label}</p>
                <p className="text-sm text-gray-700 mt-0.5">{c.value}</p>
                <p className="text-xs text-gray-400">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Your Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Aniket Joshi" className="input" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="input" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Subject *</label>
              <input name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required
                rows={5} placeholder="Describe your query in detail…" className="input resize-none" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8 py-3">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                : <><FiSend /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
