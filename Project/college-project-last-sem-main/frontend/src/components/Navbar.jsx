import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiSearch,
  FiLogOut, FiSettings, FiPackage, FiFileText, FiChevronDown
} from 'react-icons/fi'
import { MdLocalPharmacy } from 'react-icons/md'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearch = e => {
    e.preventDefault()
    if (search.trim()) { navigate(`/medicines?query=${encodeURIComponent(search)}`); setSearch('') }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/medicines', label: 'Medicines' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-primary-500/30 group-hover:rotate-12 transition-transform">
              <MdLocalPharmacy />
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter">Medi<span className="text-primary-600">Mart</span></span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden xl:flex items-center gap-1 ml-4">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all
                  ${location.pathname === l.to
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="ml-auto flex items-center gap-3">
            {/* Desktop Search Toggle (Placeholder for simplicity) */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-2xl px-4 py-2 group focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
              <FiSearch className="text-slate-400" />
              <form onSubmit={handleSearch}>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Quick search..."
                  className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 focus:w-48 transition-all"
                />
              </form>
            </div>

            {/* Cart */}
            {user && (
              <Link to="/cart" className="relative p-3 rounded-2xl bg-slate-100 hover:bg-primary-600 hover:text-white transition-all duration-300">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all">
                  <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center font-black text-sm">
                    {user.fullName?.[0]?.toUpperCase()}
                  </div>
                  <FiChevronDown className={`text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-50 animate-float"
                    onMouseLeave={() => setDropOpen(false)}>
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">@{user.loginId}</p>
                    </div>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors">
                        <FiSettings className="text-primary-500" /> Admin Control
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <FiUser className="text-slate-400" /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <FiPackage className="text-slate-400" /> Order History
                    </Link>
                    <Link to="/payments" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <FiFileText className="text-slate-400" /> My Payments
                    </Link>
                    <button onClick={() => { logout(); setDropOpen(false); navigate('/') }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1">
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 text-sm font-black text-slate-700 hover:text-primary-600 transition-colors">Log In</Link>
                <Link to="/register" className="btn-primary py-2.5 px-6 text-sm">Register Now</Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button className="xl:hidden p-3 bg-slate-100 rounded-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="xl:hidden py-6 space-y-2 border-t border-slate-100">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 rounded-xl uppercase tracking-widest">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
