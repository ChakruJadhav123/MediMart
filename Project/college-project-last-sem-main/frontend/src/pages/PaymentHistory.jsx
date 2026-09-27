import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { paymentAPI } from '../api'
import { FiCreditCard, FiAlertCircle } from 'react-icons/fi'

export default function PaymentHistory() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentAPI.getMyPayments()
      .then(res => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-primary-100 text-primary-600 rounded-2xl">
          <FiCreditCard className="text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Payments</h1>
          <p className="text-slate-500 mt-1">Track all your transaction history</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="card-premium p-12 text-center flex flex-col items-center">
          <FiAlertCircle className="text-5xl text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">No payments yet</h2>
          <p className="text-slate-500 mb-6">You haven't made any payments.</p>
          <Link to="/medicines" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-5 font-bold text-slate-600">Payment ID</th>
                  <th className="p-5 font-bold text-slate-600">Order ID</th>
                  <th className="p-5 font-bold text-slate-600">Method</th>
                  <th className="p-5 font-bold text-slate-600">Date</th>
                  <th className="p-5 font-bold text-slate-600">Amount (₹)</th>
                  <th className="p-5 font-bold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(payment => (
                  <tr key={payment.pId} className="hover:bg-slate-50/50 transition">
                    <td className="p-5 font-bold text-slate-500">#{payment.pId}</td>
                    <td className="p-5 font-bold text-primary-600">#{payment.oId}</td>
                    <td className="p-5 text-slate-600 font-medium">{payment.pMethod?.replace(/_/g, ' ')}</td>
                    <td className="p-5 text-slate-600">{payment.pDate ? new Date(payment.pDate).toLocaleDateString() : '-'}</td>
                    <td className="p-5 font-bold text-slate-900">₹{payment.pAmount}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full
                        ${payment.pStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                          payment.pStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'}`}>
                        {payment.pStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
