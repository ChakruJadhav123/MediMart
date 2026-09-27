import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "../api";
import { FiPackage, FiArrowRight } from "react-icons/fi";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-8xl">📦</div>
        <h2 className="text-2xl font-extrabold text-gray-800">No orders yet</h2>
        <p className="text-gray-500">Start shopping to place your first order</p>
        <Link to="/medicines" className="btn-primary">Shop Now</Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 page-transition">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-8 bg-primary-500 rounded-full"/>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Orders</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Track all your purchases</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.oId} className="card-premium p-8 group hover:scale-[1.01] transition-all">
            <div className="flex flex-wrap items-start justify-between gap-6 mb-6 pb-6 border-b border-slate-50">
              <div>
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">#{order.oId}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  Date: {order.oDate ? new Date(order.oDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : '—'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${STATUS_COLORS[order.oStatus] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                  {order.oStatus}
                </span>
                <Link
                  to={`/orders/${order.oId}`}
                  className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10"
                >
                  <FiArrowRight/>
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <FiPackage className="text-primary-600"/>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{order.oAddress}</p>
                </div>
              </div>
              <div className="sm:ml-auto text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">₹{order.oAmt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
