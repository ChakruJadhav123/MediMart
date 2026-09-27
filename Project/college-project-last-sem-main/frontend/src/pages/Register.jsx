import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiLock, FiPhone, FiMail, FiMapPin, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { MdLocalPharmacy } from 'react-icons/md'

export default function Register() {
  const { sendRegistrationOtp, verifyRegistrationOtp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [form, setForm] = useState({
    cFullname: '', cLoginId: '', cPassword: '', confirmPassword: '',
    cContact: '', cEmail: '', cAddress: '', cGender: ''
  })

  const handleChange = e => {
    let val = e.target.value
    if (e.target.name === 'cLoginId') val = val.replace(/\s/g, '')
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.cPassword !== form.confirmPassword) {
      toast.error('Passwords do not match'); return
    }
    if (form.cPassword.length < 6) {
      toast.error('Password must be at least 6 characters'); return
    }
    if (!form.cEmail) {
      toast.error('Email is required for OTP verification'); return
    }
    if (otpSent && otp.trim().length !== 6) {
      toast.error('Enter the 6-digit OTP sent to your email'); return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...data } = form
      if (!otpSent) {
        await sendRegistrationOtp({ cLoginId: data.cLoginId, cEmail: data.cEmail })
        setOtpSent(true)
        toast.success('OTP sent to your email.')
      } else {
        await verifyRegistrationOtp({ ...data, otp })
        toast.success('Account created! Please login.')
        navigate('/login')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            {/* <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-slate-900/20">
              <MdLocalPharmacy className="text-2xl text-primary-400"/>
            </div> */}
            <span className="text-3xl font-black text-slate-900 tracking-tighter">MediMart</span>
          </Link>
          <div className="mt-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Register for a new account</p>
          </div>
        </div>

        <div className="glass rounded-[3rem] p-10 sm:p-12 shadow-2xl shadow-slate-200/50 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="cFullname" value={form.cFullname} onChange={handleChange}
                  required maxLength={30} placeholder="Enter your full name..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            {/* Username & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="cLoginId" value={form.cLoginId} onChange={handleChange}
                    required maxLength={10} placeholder="Username..."
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="cContact" value={form.cContact} onChange={handleChange}
                    maxLength={10} placeholder="10-digit number"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="cEmail" type="email" value={form.cEmail} onChange={handleChange}
                  required maxLength={100} placeholder="you@example.com"
                  disabled={otpSent}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email OTP</label>
                <div className="relative">
                  <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    try {
                      await sendRegistrationOtp({ cLoginId: form.cLoginId, cEmail: form.cEmail })
                      toast.success('New OTP sent.')
                    } catch (err) {
                      toast.error(err.response?.data?.message || 'Could not resend OTP')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-700 transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
              <select
                name="cGender" value={form.cGender} onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="cPassword" type={showPass ? 'text' : 'password'} value={form.cPassword}
                    onChange={handleChange} required placeholder="Min 6 characters..."
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-14 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                    {showPass ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="confirmPassword" type="password" value={form.confirmPassword}
                    onChange={handleChange} required placeholder="Repeat password..."
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-6 top-5 text-slate-400" />
                <textarea
                  name="cAddress" value={form.cAddress} onChange={handleChange}
                  maxLength={50} placeholder="Delivery address..."
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30 group">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{otpSent ? 'Verify OTP & Register' : 'Send OTP'} <FiArrowRight className="group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="w-full h-px bg-slate-100 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Already have an account?</span>
            </div>
            <Link to="/login" className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-700 transition-colors">
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
