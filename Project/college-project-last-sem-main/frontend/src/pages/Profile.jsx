import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileAPI } from '../api'
import toast from 'react-hot-toast'
import { FiUser, FiSave, FiPhone, FiMapPin, FiMail, FiCreditCard } from 'react-icons/fi'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '', contact: '', email: '', address: '', gender: ''
  })

  useEffect(() => {
    if (user) setForm({
      fullName: user.fullName || '',
      contact:  user.contact || user.cContact || '',
      email:    user.email || user.cEmail   || '',
      address:  user.address || user.cAddress || '',
      gender:   user.gender || user.cGender  || ''
    })
  }, [user])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await profileAPI.update(form)
      await refreshUser()
      toast.success('Profile updated successfully!')
    } catch { toast.error('Failed to update profile') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 page-transition">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-8 bg-primary-500 rounded-full"/>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Profile</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Update your account details</p>
        </div>
      </div>

      {/* Avatar card */}
      <div className="card-premium p-10 mb-8 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 animate-pulse"/>
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl shadow-primary-500/30 ring-4 ring-white relative z-10">
          {(user?.fullName || user?.cFullname)?.[0]?.toUpperCase()}
        </div>
        <div className="text-center sm:text-left relative z-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{user?.fullName || user?.cFullname}</h2>
          <p className="text-slate-400 font-bold text-sm tracking-tight mb-1">@{user?.loginId}</p>
          <p className="text-slate-400 font-medium text-xs mb-4">{user?.cEmail}</p>
          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${user?.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Username (read-only) */}
      <div className="card-premium p-6 mb-6 flex items-center gap-4">
        <FiCreditCard className="text-slate-400 text-xl shrink-0"/>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username (read-only)</p>
          <p className="text-sm font-bold text-slate-800 mt-1">{user?.loginId}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="card-premium p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
            <FiUser className="text-xl"/>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Profile</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              name="fullName" value={form.fullName} onChange={handleChange} 
              required maxLength={30}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                  name="contact" value={form.contact} onChange={handleChange}
                  maxLength={10}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all" 
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                  name="email" type="email" value={form.email} onChange={handleChange}
                  maxLength={30}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all" 
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>
 
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
            <select 
              name="gender" value={form.gender} onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
 
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
            <div className="relative">
              <FiMapPin className="absolute left-6 top-5 text-slate-400"/>
              <textarea 
                name="address" value={form.address} onChange={handleChange}
                rows={3} maxLength={50}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all resize-none" 
                placeholder="Enter full address..."
              />
            </div>
          </div>
          
          <button 
            type="submit" disabled={loading} 
            className="btn-primary flex items-center justify-center gap-3 px-10 py-5 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30 group"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            ) : (
              <FiSave className="text-lg group-hover:scale-110 transition-transform"/>
            )}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

