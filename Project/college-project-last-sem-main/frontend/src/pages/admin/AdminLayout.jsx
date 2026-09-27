import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiFileText, FiLogOut, FiMenu, FiX, FiUser
} from 'react-icons/fi'
import { MdLocalPharmacy } from 'react-icons/md'
import { useState } from 'react'

const NAV_ITEMS = [
  { to:'/admin',              label:'Dashboard',     icon:FiGrid       },
  { to:'/admin/medicines',    label:'Medicines',     icon:FiPackage    },
  { to:'/admin/orders',       label:'Orders',        icon:FiShoppingBag},
  { to:'/admin/users',        label:'Users',         icon:FiUsers      },
  { to:'/admin/payments',     label:'Payments',      icon:FiFileText   },
  { to:'/admin/chatbot',      label:'Chatbot',       icon:FiPackage    },
  { to:'/admin/profile',     label:'My Profile',    icon:FiUser       },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-gray-900 text-white ${mobile ? 'w-64' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <MdLocalPharmacy className="text-2xl text-teal-400"/>
        <div>
          <p className="font-extrabold text-sm">MediMart</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/admin'}
            onClick={() => setSideOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <item.icon className="text-base"/>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700">
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition">
          <FiLogOut/> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col shrink-0"><Sidebar/></aside>

      {/* Mobile sidebar */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="flex-1 bg-black/50" onClick={() => setSideOpen(false)}/>
          <Sidebar mobile/>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setSideOpen(true)}>
            <FiMenu className="text-xl"/>
          </button>
          <div className="flex-1 md:flex-none">
            <p className="text-sm font-medium text-gray-500">Admin Panel</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
