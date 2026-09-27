import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { MdLocalPharmacy } from 'react-icons/md'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const location     = useLocation()
  const from         = location.state?.from || '/'
  const [form, setForm]     = useState({ loginId: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.loginId.trim(), form.password)
      toast.success(`Welcome back, ${user.fullName}!`)
      navigate(user.role === 'ADMIN' ? '/admin' : from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email/username or password')
    } finally { setLoading(false) }
  }



  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px] animate-pulse"/>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-700"/>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            {/* <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-slate-900/20">
              <MdLocalPharmacy className="text-2xl text-primary-400"/>
            </div> */}
            <span className="text-3xl font-black text-slate-900 tracking-tighter">MediMart</span>
          </Link>
          <div className="mt-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Login</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Access your account</p>
          </div>
        </div>

        <div className="glass rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email or Username</label>
              <div className="relative">
                <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                  name="loginId" type="text" value={form.loginId} onChange={handleChange}
                  required placeholder="Enter your email or username..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                  name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required placeholder="••••••••" 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-14 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                  {showPass ? <FiEyeOff className="text-lg"/> : <FiEye className="text-lg"/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30 group">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              ) : (
                <>Login <FiArrowRight className="group-hover:translate-x-2 transition-transform"/></>
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="w-full h-px bg-slate-100 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">New to MediMart?</span>
            </div>
            <Link to="/register" className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-700 transition-colors">
              Register Here
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center opacity-40">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Secure Login</p>
        </div>
      </div>
    </div>
  )
}
