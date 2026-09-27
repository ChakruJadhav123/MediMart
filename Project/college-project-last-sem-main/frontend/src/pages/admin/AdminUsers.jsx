import { useState, useEffect } from "react";
import { FiUsers, FiSearch, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { customerAPI, adminAPI } from "../../api";
import { toast } from "react-hot-toast";

const EMPTY = {
  cFullname: '',
  cLoginId: '',
  cPassword: '',
  cEmail: '',
  cContact: '',
  cGender: 'Male',
  cAddress: '',
  role: 'User'
}

export default function AdminUsers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchCustomers = () => {
    setLoading(true)
    Promise.all([
      customerAPI.adminGetAll(),
      adminAPI.getAdmins()
    ])
      .then(([custRes, adminRes]) => {
        const users = custRes.data.map(c => ({ ...c, role: 'User' }));
        const admins = adminRes.data.map(a => ({
          cId: a.aId,
          cFullname: a.aFullname,
          cLoginId: a.aLoginId,
          cEmail: a.aEmail,
          cContact: a.aContact,
          cGender: a.aGender,
          cAddress: a.aAddress,
          role: 'Admin'
        }));
        setCustomers([...admins, ...users]);
      })
      .catch(err => {
        console.error(err)
        toast.error("Failed to load users")
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCustomers() }, [])

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowModal(true); }
  const openEdit = (c) => {
    setForm({ ...c, cPassword: '' })
    setEditing(c.cId)
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        if (form.role === 'Admin') await adminAPI.updateAdmin(editing, form)
        else await customerAPI.adminUpdate(editing, form)
      } else {
        if (form.role === 'Admin') await adminAPI.createAdmin(form)
        else await customerAPI.adminCreate(form)
      }
      toast.success(`${form.role} ${editing ? 'updated' : 'added'}!`)
      setShowModal(false)
      fetchCustomers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, role) => {
    if (!window.confirm(`Delete this ${role.toLowerCase()}?`)) return
    try {
      if (role === 'Admin') await adminAPI.deleteAdmin(id)
      else await customerAPI.adminDelete(id)
      toast.success(`${role} deleted`)
      fetchCustomers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  const filtered = customers.filter(c =>
    c.cFullname?.toLowerCase().includes(search.toLowerCase()) ||
    c.cLoginId?.toLowerCase().includes(search.toLowerCase()) ||
    c.cEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-transition px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">User Management</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">{customers.length} registered users</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-4 focus:ring-primary-500/10 w-56 transition-all"
            />
          </div>
          <button onClick={openAdd} className="btn-primary py-3 px-6 flex items-center gap-2">
            <FiPlus className="text-lg" /> <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">User</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Username</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Email</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Contact</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Gender</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Address</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-6 py-6"><div className="h-10 bg-slate-50 rounded-2xl" /></td>
                  </tr>
                ))
              ) : filtered.map(c => (
                <tr key={`${c.role}-${c.cId}`} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary-500/20">
                        {c.cFullname?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-black text-slate-900 text-sm">{c.cFullname}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${c.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">@{c.cLoginId}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">{c.cEmail || '—'}</td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-bold text-primary-600">{c.cContact || '—'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${c.cGender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {c.cGender}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 max-w-[200px] truncate">{c.cAddress || '—'}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(c)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button onClick={() => handleDelete(c.cId, c.role)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="py-16 text-center flex flex-col items-center gap-3">
              <FiUsers className="text-4xl text-slate-200" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Centered Large Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-float-slow">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{editing ? 'Update User' : 'Add New User'}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Fill in the profile details below</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-white rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"><FiX className="text-xl" /></button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-8 flex flex-col">
              <div className="flex-1 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                    <select disabled={!!editing} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                      className="input-modern appearance-none disabled:opacity-50">
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input required value={form.cFullname} onChange={e => setForm({ ...form, cFullname: e.target.value })}
                      className="input-modern" placeholder="John Doe" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input required type="email" value={form.cEmail} onChange={e => setForm({ ...form, cEmail: e.target.value })}
                      className="input-modern" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                    <input required disabled={!!editing} value={form.cLoginId} onChange={e => setForm({ ...form, cLoginId: e.target.value })}
                      className="input-modern disabled:opacity-50" placeholder="johndoe" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{editing ? 'New Password (optional)' : 'Password'}</label>
                    <input required={!editing} type="password" value={form.cPassword} onChange={e => setForm({ ...form, cPassword: e.target.value })}
                      className="input-modern" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                    <input required value={form.cContact} onChange={e => setForm({ ...form, cContact: e.target.value })}
                      className="input-modern" placeholder="10-digit number" />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select value={form.cGender} onChange={e => setForm({ ...form, cGender: e.target.value })}
                      className="input-modern appearance-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Residential Address</label>
                    <input value={form.cAddress} onChange={e => setForm({ ...form, cAddress: e.target.value })}
                      className="input-modern" placeholder="Enter full address..." />
                  </div>
                </div>
                <div className="pt-10 border-t border-slate-100 flex gap-4 bg-slate-50/30">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Dismiss</button>
                  <button type="submit" disabled={saving}
                    className="flex-[2] btn-primary py-4 text-xs font-black uppercase tracking-widest shadow-2xl">
                    {saving ? 'Processing...' : (editing ? `Apply Changes to ${form.role}` : `Create ${form.role} Account`)}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

