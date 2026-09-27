import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api';
import { FiPrinter, FiDownload, FiArrowLeft, FiPackage, FiMapPin, FiPhone } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function Invoice() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }
    orderAPI.getById(orderId)
      .then(res => setOrder(res.data))
      .catch(() => {
        toast.error("Failed to load invoice");
        navigate('/orders');
      })
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 page-transition">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-10 no-print">
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-all">
          <FiArrowLeft className="text-lg" /> Back to Orders
        </button>
        <div className="flex gap-4">
          <button onClick={handlePrint} className="btn-primary py-3 px-6 flex items-center gap-2 text-xs">
            <FiPrinter /> Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div id="invoice" className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-12 md:p-20 relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
            <FiPackage className="text-[12rem] text-slate-900" />
        </div>

        {/* Brand Header */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl">💊</div>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">MediMart</span>
            </div>
            <div className="text-slate-500 text-sm font-medium space-y-1">
              <p className="flex items-center gap-2"><FiMapPin className="text-primary-500" /> 123 Healthcare Avenue, Mumbai, MH 400001</p>
              <p className="flex items-center gap-2"><FiPhone className="text-primary-500" /> +91 98765 43210</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 uppercase italic opacity-10">INVOICE</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Order Reference</p>
            <p className="text-2xl font-black text-primary-600 tracking-tight">#{order.oId}</p>
            <p className="text-sm font-bold text-slate-500 mt-2">{new Date(order.oDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Billed To</p>
            <p className="text-xl font-black text-slate-900 mb-1">{order.cFullname}</p>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">{order.oAddress}</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Payment Info</p>
            <p className="text-lg font-black text-slate-900 mb-1">{order.paymentMethod.replace(/_/g, ' ')}</p>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-lg">Status: {order.oStatus}</span>
          </div>
        </div>

        {/* Table */}
        <div className="mb-16">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-900/5">
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Medicine Description</th>
                <th className="py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                <th className="py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                <th className="py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.items?.map(item => (
                <tr key={item.mId}>
                  <td className="py-6 pr-4">
                    <p className="font-black text-slate-900">{item.mName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.mCategory}</p>
                  </td>
                  <td className="py-6 text-center text-sm font-bold text-slate-600">₹{item.mPrice}</td>
                  <td className="py-6 text-center text-sm font-black text-slate-900">{item.quantity}</td>
                  <td className="py-6 text-right font-black text-slate-900">₹{item.mPrice * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="flex justify-end pt-8 border-t-2 border-slate-900/5">
          <div className="w-full max-w-xs space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
              <span className="font-bold text-slate-900">₹{order.oAmount - (order.oAmount < 499 ? 49 : 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Delivery Fee</span>
              <span className="font-bold text-slate-900">₹{order.oAmount < 499 ? 49 : 0}</span>
            </div>
            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">Total Amount</span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{order.oAmount}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-50 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Thank you for choosing MediMart</p>
            <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #invoice, #invoice * { visibility: visible; }
          #invoice { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; }
          .no-print { display: none; }
        }
      `}} />
    </div>
  );
}
