import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { medicineAPI } from '../api'
import MedicineCard from '../components/MedicineCard'
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiChevronDown, FiLoader } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const SORT_OPTIONS = [
  { value:'latest',    label:'Latest' },
  { value:'price_asc', label:'Price: Low to High' },
  { value:'price_desc',label:'Price: High to Low' },
  { value:'name',      label:'Name: A-Z' },
]

export default function Medicines() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allData,    setAllData]    = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const query    = searchParams.get('query')    || ''
  const category = searchParams.get('category') || ''
  const sortBy   = searchParams.get('sortBy')   || 'latest'
  const page     = parseInt(searchParams.get('page') || '0')
  const pageSize = 6

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    if (key !== 'page') p.set('page', '0')
    setSearchParams(p)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await medicineAPI.getAll({ name: query })
      const data = res.data || []
      setAllData(data)
      
      // Derive categories
      const cats = [...new Set(data.map(m => m.mCategory).filter(Boolean))]
      setCategories(cats)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load medicines")
      setAllData([])
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => { fetchData() }, [fetchData])

  // Filter and Sort client-side for immediate feedback
  const filteredData = useMemo(() => {
    let data = [...allData]
    if (category) {
      data = data.filter(m => m.mCategory?.toLowerCase() === category.toLowerCase())
    }
    
    if (sortBy === 'price_asc') data.sort((a,b) => a.mPrice - b.mPrice)
    else if (sortBy === 'price_desc') data.sort((a,b) => b.mPrice - a.mPrice)
    else if (sortBy === 'name') data.sort((a,b) => (a.mName||'').localeCompare(b.mName||''))
    
    return data
  }, [allData, category, sortBy])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = page * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

  const Sidebar = () => (
    <div className={`space-y-8 ${showFilter ? 'block' : 'hidden lg:block'}`}>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="text-primary-600"/>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</h3>
        </div>
        <div className="space-y-1">
          <button onClick={() => updateParam('category', '')}
            className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all ${!category ? 'bg-slate-900 text-white font-bold shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
            All Categories
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => updateParam('category', cat)}
              className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all ${category === cat ? 'bg-primary-600 text-white font-bold shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {(query || category) && (
        <button onClick={() => setSearchParams({})}
          className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2">
          <FiX/> Clear Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 page-transition">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-1 w-12 bg-primary-500 rounded-full"/>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Catalog</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            {category || 'Medicines'}
            {query && <span className="text-primary-600 ml-4 opacity-50">/ "{query}"</span>}
          </h1>
          {!loading && <p className="text-slate-500 mt-2 font-medium">{filteredData.length} items found</p>}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select 
              value={sortBy} 
              onChange={e => updateParam('sortBy', e.target.value)}
              className="appearance-none bg-white border-2 border-slate-100 px-6 py-3.5 pr-12 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer shadow-sm"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors"/>
          </div>
          
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {showFilter ? <FiX className="text-xl"/> : <FiFilter className="text-xl"/>}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-12">
        <Sidebar />

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-32 bg-slate-50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-200/50">
                <FiSearch className="text-5xl text-slate-200"/>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No results</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">No items matched your criteria.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-8 btn-primary px-8"
              >
                Reset
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedData.map(m => <MedicineCard key={m.mId} medicine={m}/>)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-20">
                  <button 
                    disabled={page === 0}
                    onClick={() => updateParam('page', String(page-1))}
                    className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 disabled:opacity-20 transition-all shadow-sm"
                  >
                    <FiChevronLeft className="text-2xl"/>
                  </button>
                  
                  {[...Array(totalPages)].map((_,i) => (
                    <button key={i}
                      onClick={() => updateParam('page', String(i))}
                      className={`w-14 h-14 rounded-2xl text-sm font-black transition-all duration-300 ${i === page ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
                      {i+1}
                    </button>
                  ))}
                  
                  <button 
                    disabled={page === totalPages-1}
                    onClick={() => updateParam('page', String(page+1))}
                    className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 disabled:opacity-20 transition-all shadow-sm"
                  >
                    <FiChevronRight className="text-2xl"/>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
