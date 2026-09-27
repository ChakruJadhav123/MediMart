import { useState, useEffect } from "react";
import { orderAPI } from "../../api";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];
const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.adminGetAll();
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderAPI.adminUpdate(id, status);
      setOrders(prev => prev.map(o => o.oId === id ? { ...o, oStatus: status } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="page-transition px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order Management</h1>
          <p className="text-sm text-slate-500 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Address</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6"><div className="h-10 bg-slate-50 rounded-2xl"/></td>
                  </tr>
                ))
              ) : orders.map(order => (
                <tr key={order.oId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-black text-slate-900 text-sm">#{order.oId}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-slate-900 text-sm">{order.cFullname}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-slate-500 truncate max-w-[120px] block">{order.oAddress}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-black text-slate-900">₹{order.oAmt}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {order.oDate ? new Date(order.oDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-block relative">
                      <select
                        value={order.oStatus}
                        onChange={e => handleStatusChange(order.oId, e.target.value)}
                        className={`appearance-none text-[10px] font-black px-4 py-2 pr-10 rounded-xl border-none outline-none cursor-pointer transition-all ${STATUS_COLORS[order.oStatus] || "bg-slate-100 text-slate-700"}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !loading && (
            <div className="py-16 text-center">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
