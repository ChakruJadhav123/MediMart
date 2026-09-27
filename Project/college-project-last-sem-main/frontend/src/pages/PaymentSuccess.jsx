import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiFileText, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import Confetti from 'react-confetti';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 page-transition relative overflow-hidden">
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} colors={['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd']} />
      
      <div className="max-w-md w-full text-center space-y-8 animate-float">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/20 border-2 border-white">
            <FiCheckCircle className="text-5xl text-primary-600 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg">
            <FiCheckCircle />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Payment Successful!</h1>
          <p className="text-slate-500 font-medium">Your health is our priority. Your order <span className="text-primary-600 font-bold">#{orderId}</span> has been confirmed and is being processed.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <button 
            onClick={() => navigate(`/invoice?orderId=${orderId}`)}
            className="w-full btn-primary py-5 flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/30 group"
          >
            <FiFileText className="text-xl" />
            <span className="text-xs font-black uppercase tracking-widest">Download Invoice</span>
            <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/orders')}
            className="w-full bg-white border-2 border-slate-100 py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-3"
          >
            <FiShoppingBag className="text-lg" />
            View My Orders
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estimated Delivery: 2-3 Business Days</p>
        </div>
      </div>
    </div>
  );
}
