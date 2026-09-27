import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { medicineAPI } from '../api'
import MedicineCard from '../components/MedicineCard'
import { FiArrowRight, FiShield, FiTruck, FiClock, FiActivity } from 'react-icons/fi'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    medicineAPI.getAll()
      .then(r => setFeatured((r.data || []).slice(0, 4)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Authentic Pharmaceuticals
              </span>
              <span className="w-12 h-px bg-slate-700" />
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
              Your Health, <br />
              <span className="text-primary-500 italic">Digitally</span> Secured.
            </h1>

            <p className="text-lg text-slate-400 mb-12 leading-relaxed max-w-lg font-medium">
              Get genuine medicines delivered to your doorstep. Verified, certified, and fast delivery.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/medicines" className="btn-primary px-10 py-5 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30">
                Shop Now
              </Link>
              <Link to="/about" className="px-10 py-5 text-xs font-black uppercase tracking-widest text-white hover:text-primary-400 transition-colors">
                About Us
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-20 border-t border-slate-800 pt-12">
              {[
                { label: 'Active Users', val: '50k+' },
                { label: 'Products', val: '1.2k+' },
                { label: 'Hospitals', val: '200+' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: FiShield, title: 'Certified Safe', desc: 'Every product undergoes rigorous verification.' },
            { icon: FiTruck, title: 'Logistics', desc: 'Temperature-controlled express delivery for all shipments.' },
            { icon: FiClock, title: '24/7 Access', desc: 'Round-the-clock support for all your needs.' },
          ].map((f, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/5">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 mb-8">
                <f.icon />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-1 w-10 bg-primary-600 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trending Now</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Featured Medicines</h2>
            </div>
            <Link to="/medicines" className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-600 hover:gap-4 transition-all">
              View Catalog <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white border border-slate-100 animate-pulse" />
              ))
            ) : featured.length > 0 ? (
              featured.map(m => <MedicineCard key={m.mId} medicine={m} />)
            ) : (
              <div className="col-span-full py-20 text-center">
                <FiActivity className="text-4xl text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No compounds currently featured</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA 
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="relative bg-primary-600 rounded-[4rem] p-12 sm:p-20 overflow-hidden shadow-2xl shadow-primary-500/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/20 blur-[80px] -ml-32 -mb-32" />
          
          <div className="relative max-w-xl">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-tight mb-8">
              Join the future of <br />
              <span className="opacity-50">pharmaceutical care.</span>
            </h2>
            <p className="text-primary-100 mb-12 text-lg font-medium leading-relaxed">
              Create your account today and unlock professional grade medical access and history tracking.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="bg-white text-primary-600 px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section> 
      */}
    </div>
  )
}
