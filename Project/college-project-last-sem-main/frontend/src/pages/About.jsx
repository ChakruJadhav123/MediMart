import { FiAward, FiShield, FiTruck, FiUsers } from 'react-icons/fi'
import { MdLocalPharmacy } from 'react-icons/md'

export default function About() {
  const stats = [
    { label:'Happy Customers', value:'10+', icon:'😊' },
    { label:'Medicines Listed', value:'35+',  icon:'💊' },
    { label:'Cities Served',   value:'1',      icon:'🏙️' },
    { label:'Years of Trust',  value:'0+',       icon:'⭐' },
  ]
  const values = [
    { icon:FiShield, title:'100% Genuine',    desc:'All medicines sourced directly from licensed manufacturers and distributors.' },
    // { icon:FiTruck,  title:'Fast Delivery',   desc:'Same-day delivery in select cities. Express delivery for urgent medicines.' },
    { icon:FiAward,  title:'Quality First',   desc:'Every product is quality-checked and stored in temperature-controlled facilities.' },
    // { icon:FiUsers,  title:'Expert Support',  desc:'Board-certified pharmacists available 24/7 for your health queries.' },
  ]

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-teal-600 text-white py-20 text-center px-4">
        <MdLocalPharmacy className="mx-auto text-6xl text-teal-300 mb-4"/>
        <h1 className="text-4xl font-extrabold mb-4">About MediMart</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          India's trusted online pharmacy, delivering genuine medicines and healthcare products to your doorstep.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="card p-6 text-center hover:-translate-y-1 transition">
            <div className="text-4xl mb-2">{s.icon}</div>
            <div className="text-3xl font-extrabold text-primary-700">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            MediMart was founded with a simple mission: make healthcare accessible and affordable for every Indian. 
            We believe that quality medicines should reach every home, from metro cities to small towns. 
            Our platform connects you with certified pharmacies and ensures you get 100% genuine medicines at the best prices.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Why Choose MediMart?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map(v => (
            <div key={v.title} className="card p-6 flex gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
                <v.icon className="text-xl"/>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
