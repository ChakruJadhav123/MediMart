import { Link } from 'react-router-dom'
import { MdLocalPharmacy } from 'react-icons/md'
import { FiTwitter, FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-primary-500/30">
              <MdLocalPharmacy />
            </div>
            <span className="font-black text-2xl text-white tracking-tighter">Medi<span className="text-primary-600">Mart</span></span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Redefining the pharmaceutical experience through technology and care. Your health, our priority.
          </p>
          <div className="flex gap-4">
            {[FiTwitter, FiFacebook, FiInstagram].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-white/5 hover:bg-primary-600 hover:text-white rounded-xl flex items-center justify-center transition-all">
                <Icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">Discover</h4>
          <div className="space-y-4 text-sm font-bold">
            {[['/', 'Home'], ['/medicines', 'All Medicines'], ['/about', 'Our Story'], ['/contact', 'Get in Touch']].map(([to, label]) => (
              <Link key={to} to={to} className="block hover:text-primary-400 transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">Categories</h4>
          <div className="space-y-4 text-sm font-bold">
            {['Fever & Pain', 'Antibiotics', 'Vitamins', 'Diabetes', 'Allergy', 'Gastro Care'].map(c => (
              <Link key={c} to={`/medicines?category=${c}`} className="block hover:text-primary-400 transition-colors">{c}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">Headquarters</h4>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-primary-500 mt-1 shrink-0" />
              <span>SIOM, <br />Vadgaon(Budruk) , Pune</span>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-primary-500 shrink-0" />
              <span>+91 7219467259</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-primary-500 shrink-0" />
              <span>care@medimart.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
        © {new Date().getFullYear()} MediMart Pharma.
      </div>
    </footer>
  )
}
