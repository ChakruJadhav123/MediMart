import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { medicineAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus, FiCheckCircle, FiTruck, FiShield } from 'react-icons/fi'

export default function MedicineDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { addToCart } = useCart()
  const [medicine, setMedicine] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [qty,      setQty]      = useState(1)
  const [adding,   setAdding]   = useState(false)

  useEffect(() => {
    medicineAPI.getById(id)
      .then(r => setMedicine(r.data))
      .catch(() => navigate('/medicines'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleAdd = () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      addToCart(medicine, qty)
      toast.success(`${medicine.mName} added to cart!`)
    } catch { toast.error('Error adding to cart') }
    finally { setAdding(false) }
  }

  const [imgError, setImgError] = useState(false);
  const [imgExt, setImgExt] = useState(".jpg");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
    </div>
  )
  if (!medicine) return null

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 page-transition">
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 mb-10 transition-all"
      >
        <FiArrowLeft className="text-lg group-hover:-translate-x-2 transition-transform"/> Back to Catalog
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Image */}
        <div className="card-premium p-12 flex items-center justify-center bg-slate-50/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
          {(!imgError && (medicine.mImage || medicine.mName)) ? (
            <img 
              src={
                medicine.mImage
                  ? medicine.mImage.startsWith("/")
                    ? medicine.mImage
                    : `/images/${medicine.mImage}`
                  : `/images/${medicine.mName}${imgExt}`
              }
              alt={medicine.mName}
              className="max-h-[400px] w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              onError={() => {
                if (imgExt === ".jpg") {
                  setImgExt(".png");
                } else {
                  setImgError(true);
                }
              }}
            />
          ) : (
            <span className="text-[120px] select-none group-hover:scale-105 transition-transform duration-700">💊</span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-lg">{medicine.mCategory}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">{medicine.mName}</h1>
            {medicine.mUnit && <p className="text-slate-500 mt-2 font-medium">Pack of {medicine.mUnit} units</p>}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-slate-900 leading-none">₹{medicine.mPrice}</span>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
                <button 
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all"
                >
                  <FiMinus/>
                </button>
                <span className="w-12 text-center font-black text-slate-900">{qty}</span>
                <button 
                  onClick={() => setQty(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all"
                >
                  <FiPlus/>
                </button>
              </div>
              
              <button 
                onClick={handleAdd} 
                disabled={adding}
                className="flex-1 btn-primary py-5 text-lg shadow-2xl shadow-primary-500/20"
              >
                {adding ? (
                  <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin block mx-auto"/>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <FiShoppingCart className="text-xl"/> Add to Cart
                  </span>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-100">
              {[
                { icon: FiCheckCircle, label: 'Authentic\nProduct',  bg: 'bg-emerald-50 text-emerald-600' },
                { icon: FiTruck,       label: 'Express\nDelivery',   bg: 'bg-blue-50 text-blue-600' },
                { icon: FiShield,      label: 'Secure\nPayment',     bg: 'bg-purple-50 text-purple-600' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 ${b.bg} rounded-full flex items-center justify-center text-lg shadow-sm`}>
                    <b.icon/>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-pre-line">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
