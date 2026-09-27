import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI, paymentAPI } from '../api'
import toast from 'react-hot-toast'
import { FiCreditCard, FiTruck, FiDollarSign, FiLock, FiLoader } from 'react-icons/fi'
import { FaRupeeSign } from "react-icons/fa";

const PAYMENT_METHODS = [
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', desc: 'Pay when delivered' },
  { value: 'CARD', label: 'Credit / Debit Card', desc: 'Pay with card via Razorpay' },
  { value: 'UPI', label: 'UPI', desc: 'Google Pay, PhonePe, Razorpay' },
  { value: 'NET_BANKING', label: 'Net Banking', desc: 'All major banks via Razorpay' },
]

const UPI_APPS = [
  { id: 'phonepe', label: 'PhonePe', color: 'bg-indigo-600' },
  { id: 'paytm', label: 'Paytm', color: 'bg-blue-500' },
  { id: 'gpay', label: 'G-Pay', color: 'bg-rose-500' },
  { id: 'qr', label: 'QR Code', color: 'bg-slate-800' }
]

const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB']

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedUpi, setSelectedUpi] = useState('')
  const [qrLoading, setQrLoading] = useState(false)
  const [paymentQr, setPaymentQr] = useState(null)

  const [form, setForm] = useState({
    oAddress: user?.address || '',
    paymentMethod: 'CASH_ON_DELIVERY',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
    bank: ''
  })

  const freeDelivery = parseFloat(cart.totalAmount || 0) >= 499
  const delivery = freeDelivery ? 0 : 49
  const grandTotal = (parseFloat(cart.totalAmount || 0) + delivery).toFixed(2)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  useEffect(() => {
    if (form.paymentMethod !== 'UPI' || selectedUpi !== 'qr') {
      setPaymentQr(null)
      return
    }

    let cancelled = false
    const loadQr = async () => {
      setQrLoading(true)
      try {
        const res = await paymentAPI.generateQr({
          amount: Math.round(parseFloat(grandTotal) * 100),
          paymentMethod: 'UPI'
        })
        if (!cancelled) setPaymentQr(res.data)
      } catch (err) {
        if (!cancelled) toast.error(err.response?.data?.message || 'Could not generate QR code')
      } finally {
        if (!cancelled) setQrLoading(false)
      }
    }

    loadQr()
    return () => { cancelled = true }
  }, [form.paymentMethod, selectedUpi, grandTotal])

  const placeBackendOrder = async (paymentId = null) => {
    setLoading(true)
    try {
      const items = cart.items.map(i => ({ mId: i.mId, quantity: i.quantity }))
      const payload = {
        oAddress: form.oAddress,
        paymentMethod: form.paymentMethod,
        items
      }
      // If we had a paymentId field in backend, we'd add it to payload
      const res = await orderAPI.place(payload)
      toast.success('Order placed successfully!')
      clearCart()
      navigate(`/payment-success?orderId=${res.data.oId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed')
      setLoading(false)
    }
  }

  const handlePayment = () => {
    if (form.paymentMethod === 'CASH_ON_DELIVERY') {
      placeBackendOrder();
      return;
    }

    const options = {
      key: "rzp_test_dummyKeyForCollegeProject",
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      name: "MediMart",
      description: "Health & Pharmacy Order",
      image: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png",
      handler: function (response) {
        placeBackendOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: user?.cFullname || "Customer",
        email: user?.cEmail || "customer@example.com",
        contact: user?.cPhone || "9999999999"
      },
      theme: {
        color: "#0284c7"
      }
    };

    if (window.Razorpay && !options.key.includes("dummy")) {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error.description || "Payment failed");
      });
      rzp.open();
    } else {
      // Simulation for College Project Demo
      setLoading(true);
      const toastId = toast.loading("Connecting to secure payment gateway...");
      
      setTimeout(() => {
        toast.success("Payment authorized successfully!", { id: toastId });
        placeBackendOrder("sim_pay_" + Math.random().toString(36).substring(7));
      }, 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    handlePayment()
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-black text-slate-800">Your cart is empty</h2>
        <button onClick={() => navigate('/medicines')} className="btn-primary">Go to Shop</button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 page-transition">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-8 bg-primary-500 rounded-full" />
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Checkout</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Finalize your order details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Delivery */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-premium p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                  <FiTruck className="text-xl" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Delivery Address</h2>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                <textarea
                  name="oAddress" value={form.oAddress} onChange={handleChange}
                  required rows={4}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                  placeholder="Enter your full street address for delivery..."
                />
              </div>
            </div>

            <div className="card-premium p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                  <FiCreditCard className="text-xl" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Payment Method</h2>
              </div>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: method.value })}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all ${form.paymentMethod === method.value
                        ? 'border-primary-500 bg-primary-50/50'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                    >
                      <div className="text-left">
                        <p className={`text-sm font-black ${form.paymentMethod === method.value ? 'text-primary-700' : 'text-slate-800'}`}>{method.label}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Sub-options for Card */}
                {form.paymentMethod === 'CARD' && (
                  <div className="p-8 bg-slate-50 rounded-3xl space-y-6 border border-slate-100 animate-float">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                        <input name="cardName" value={form.cardName} onChange={handleChange}
                          className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="JOHN DOE" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                        <input name="cardNumber" value={form.cardNumber} onChange={handleChange}
                          className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                        <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange}
                          className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                        <input name="cardCvv" value={form.cardCvv} onChange={handleChange}
                          className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="***" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-options for UPI */}
                {form.paymentMethod === 'UPI' && (
                  <div className="p-8 bg-slate-50 rounded-3xl space-y-8 border border-slate-100 animate-float">
                    <div className="grid grid-cols-4 gap-4">
                      {UPI_APPS.map(app => (
                        <button key={app.id} type="button" onClick={() => setSelectedUpi(app.id)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${selectedUpi === app.id ? 'bg-white shadow-xl scale-105' : 'hover:bg-white/50'}`}>
                          <div className={`w-10 h-10 rounded-full ${app.color} shadow-lg`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{app.label}</span>
                        </button>
                      ))}
                    </div>
                    {selectedUpi === 'qr' ? (
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-40 h-40 bg-white rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center p-4">
                          {qrLoading ? (
                            <FiLoader className="animate-spin text-2xl text-slate-400" />
                          ) : paymentQr?.qrImage ? (
                            <img src={paymentQr.qrImage} alt="UPI payment QR code" className="w-full h-full object-contain rounded-xl" />
                          ) : (
                            <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest">QR</div>
                          )}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan with any UPI app</p>
                        {paymentQr?.transactionRef && (
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Ref: {paymentQr.transactionRef}</p>
                        )}
                      </div>
                    ) : selectedUpi && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enter UPI ID</label>
                        <input name="upiId" value={form.upiId} onChange={handleChange}
                          className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="user@upi" />
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-options for Net Banking */}
                {form.paymentMethod === 'NET_BANKING' && (
                  <div className="p-8 bg-slate-50 rounded-3xl space-y-6 border border-slate-100 animate-float">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Bank</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {BANKS.map(bank => (
                        <button key={bank} type="button" onClick={() => setForm({ ...form, bank })}
                          className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${form.bank === bank ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-white text-slate-600 hover:border-slate-200'}`}>
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="relative">
            <div className="glass rounded-[2.5rem] p-8 sticky top-24 shadow-2xl shadow-slate-200/50 border border-white">
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Order Summary</h3>

              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto no-scrollbar">
                {cart.items?.map(item => (
                  <div key={item.mId} className="flex justify-between items-start">
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-slate-900 text-xs truncate">{item.mName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-slate-900 text-xs shrink-0">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-slate-100 my-6" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                  <span className="font-bold text-slate-900">₹{parseFloat(cart.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</span>
                  <span className={`font-bold ${freeDelivery ? 'text-emerald-500' : 'text-slate-900'}`}>{freeDelivery ? 'FREE' : `₹${delivery}`}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">₹{grandTotal}</p>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full mt-10 py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30 group">
                {loading
                  ? <><FiLoader className="animate-spin text-lg" /> Processing...</>
                  : <><FaRupeeSign className="text-lg" /> Place Order</>
                }
              </button>
              <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
                <FiLock className="text-xs" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
