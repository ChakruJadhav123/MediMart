import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../api'
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiClock, FiTrendingUp } from 'react-icons/fi'
import { FaRupeeSign } from "react-icons/fa";

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  const stats = data ? [
    { label: 'Total Users', value: data.totalCustomers, icon: FiUsers, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700' },
    { label: 'Total Medicines', value: data.totalMedicines, icon: FiPackage, color: 'bg-green-500', light: 'bg-green-50 text-green-700' },
    { label: 'Total Orders', value: data.totalOrders, icon: FiShoppingBag, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-700' },
    { label: 'Pending Orders', value: data.pendingOrders, icon: FiClock, color: 'bg-yellow-500', light: 'bg-yellow-50 text-yellow-700' },
    { label: "Today's Orders", value: data.todayOrders, icon: FiTrendingUp, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700' },
    { label: 'Total Revenue', value: `₹${parseFloat(data.totalRevenue || 0).toFixed(2)}`, icon: FaRupeeSign, color: 'bg-teal-500', light: 'bg-teal-50 text-teal-700' },
  ] : []

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="page-transition px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-1 w-12 bg-primary-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Overview</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard</h1>
        </div>
        <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Sync Active</span>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="card-premium p-6 group hover:scale-105 transition-all">
            <div className={`w-12 h-12 ${stat.light} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="text-xl" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {data?.lowStockMedicines?.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FiPackage className="text-xl" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Critical Inventory Alerts</h2>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase tracking-widest">{data.lowStockMedicines.length} Items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.lowStockMedicines.map(m => (
              <div key={m.id} className="relative group overflow-hidden bg-white rounded-[2rem] border border-red-100 p-6 shadow-xl shadow-red-500/5 hover:shadow-red-500/10 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Replenish Now</p>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-4">{m.name}</h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Units</p>
                      <p className="text-3xl font-black text-slate-900 leading-none mt-1">{m.stockQuantity}</p>
                    </div>
                    <a href="/admin/medicines" className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors">
                      <FiTrendingUp />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 grid lg:grid-cols-3 gap-12">
        {/* Quick Management Section */}
        <div className="lg:col-span-2 card-premium p-8">
          <h3 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Express Management</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Medicines', to: '/admin/medicines', icon: FiPackage, color: 'bg-primary-50 text-primary-600' },
              { label: 'Orders', to: '/admin/orders', icon: FiShoppingBag, color: 'bg-amber-50 text-amber-600' },
              { label: 'Users', to: '/admin/users', icon: FiUsers, color: 'bg-indigo-50 text-indigo-600' },
            ].map(a => (
              <Link key={a.to} to={a.to}
                className="group p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 flex flex-col items-center text-center">
                <div className={`w-14 h-14 ${a.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                  <a.icon className="text-2xl" />
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* System Activity Sidebar (Placeholder) */}
        {/* <div className="glass rounded-[2.5rem] p-8">
          <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 group">
                <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0 group-hover:bg-primary-100 transition-colors" />
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-slate-100 rounded group-hover:bg-primary-200 transition-colors" />
                  <div className="h-2 w-24 bg-slate-50 rounded" />
                </div>
              </div>
            ))}
           
      </div> */}

      </div >
    </div >
  )
}

