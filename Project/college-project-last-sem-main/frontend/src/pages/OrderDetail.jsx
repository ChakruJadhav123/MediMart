import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orderAPI } from '../api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiMapPin, FiPackage, FiShoppingBag } from 'react-icons/fi'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  DELIVERED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = () => {
    orderAPI.getById(id).then(r => setOrder(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrder() }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
    </div>
  )
  if (!order) return null

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 page-transition">
      <Link to="/orders" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 mb-10 transition-all">
        <FiArrowLeft className="text-lg group-hover:-translate-x-2 transition-transform"/> Back to History
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-1 w-8 bg-slate-200 rounded-full"/>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Details</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Order #{order.oId}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            Order Date: {order.oDate ? new Date(order.oDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>
        <span className={`text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] border ${STATUS_COLORS[order.oStatus] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
          {order.oStatus}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                <FiPackage className="text-xl"/>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Items in Order</h3>
            </div>
            
            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-primary-50 transition-colors">
                      {/* Removed emoji */}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">{item.mName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">₹{item.price * item.quantity}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1">₹{item.price} per unit</p>
                  </div>
                </div>
              ))}
              {(!order.items || order.items.length === 0) && (
                <p className="py-10 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">No items found</p>
              )}
            </div>

            <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{order.oAmt}</span>
            </div>
          </div>
        </div>

        {/* Logistic Info */}
        <div className="space-y-6">
          <div className="card-premium p-8 bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <FiMapPin className="text-primary-400"/> Delivery Address
            </h4>
            <p className="text-sm font-medium leading-relaxed text-slate-300">{order.oAddress}</p>
          </div>

          {order.oStatus === 'PENDING' && (
            <button
              onClick={async () => {
                if (window.confirm('Cancel this order?')) {
                  try {
                    await orderAPI.cancel(order.oId)
                    toast.success('Order cancelled successfully')
                    fetchOrder()
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Cancellation failed')
                  }
                }
              }}
              className="w-full py-5 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-[2rem] hover:bg-rose-100 hover:text-rose-700 transition-all shadow-lg shadow-rose-500/5 border border-rose-100"
            >
              Cancel Order
            </button>
          )}

          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <FiShoppingBag className="text-xl"/>
              </div>
              <h4 className="font-black text-slate-900 tracking-tight">Need Help?</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">If you have issues with this order, please contact our 24/7 support.</p>
            <Link to="/contact" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Contact Support &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
