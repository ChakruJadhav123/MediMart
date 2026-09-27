import { useState, useEffect } from 'react'
import { paymentAPI } from '../../api'
import { FiDollarSign, FiCreditCard } from 'react-icons/fi'
import { FaRupeeSign } from "react-icons/fa";
import toast from 'react-hot-toast'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = () => {
    paymentAPI.adminGetAll()
      .then(res => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPayments() }, [])

  const handleStatusChange = (id, newStatus) => {
    paymentAPI.adminUpdateStatus(id, newStatus)
      .then(() => { toast.success(`Status updated to ${newStatus}`); fetchPayments() })
      .catch(err => toast.error(err.response?.data?.message || 'Failed to update'))
  }

  const totalRevenue = payments
    .filter(p => p.pStatus === 'PAID')
    .reduce((sum, p) => sum + (p.pAmount || 0), 0)

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading payments...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Payment Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-2xl">
            <FaRupeeSign />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Total Revenue (PAID)</p>
            <p className="text-2xl font-black text-slate-900">₹{totalRevenue}</p>
          </div>
        </div>
        <div className="card-premium p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
            <FiCreditCard />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Total Transactions</p>
            <p className="text-2xl font-black text-slate-900">{payments.length}</p>
          </div>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 font-bold text-slate-600">P.ID</th>
                <th className="p-4 font-bold text-slate-600">O.ID</th>
                <th className="p-4 font-bold text-slate-600">Method</th>
                <th className="p-4 font-bold text-slate-600">Date</th>
                <th className="p-4 font-bold text-slate-600">Amount</th>
                <th className="p-4 font-bold text-slate-600">Status</th>
                <th className="p-4 font-bold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(payment => (
                <tr key={payment.pId} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-sm font-medium text-slate-500">#{payment.pId}</td>
                  <td className="p-4 font-bold text-primary-600">#{payment.oId}</td>
                  <td className="p-4 text-sm text-slate-600">{payment.pMethod?.replace(/_/g, ' ')}</td>
                  <td className="p-4 text-sm text-slate-600">{payment.pDate ? new Date(payment.pDate).toLocaleDateString() : '-'}</td>
                  <td className="p-4 font-bold text-slate-900">₹{payment.pAmount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg
                      ${payment.pStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                        payment.pStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'}`}>
                      {payment.pStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      className="text-sm border-slate-200 rounded-lg bg-slate-50 py-1.5 px-3 font-medium"
                      value={payment.pStatus}
                      onChange={(e) => handleStatusChange(payment.pId, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
