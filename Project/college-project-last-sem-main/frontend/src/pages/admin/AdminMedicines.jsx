import { useState, useEffect } from "react";
import { medicineAPI } from "../../api";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const EMPTY = {
  mName: "",
  mPrice: "",
  mUnit: "",
  mCategory: "",
  mImage: "",
};

function MedicineImage({ m }) {
  const [imgError, setImgError] = useState(false);
  const [imgExt, setImgExt] = useState(".jpg");

  if (imgError) return (
    <div className="w-full h-full bg-primary-50 rounded-lg flex items-center justify-center text-lg">💊</div>
  );

  return (
    <img
      src={
        m.mImage
          ? m.mImage.startsWith("/")
            ? m.mImage
            : `/images/${m.mImage}`
          : `/images/${m.mName}${imgExt}`
      }
      alt={m.mName}
      className="w-full h-full object-contain rounded-lg"
      onError={() => {
        if (imgExt === ".jpg") {
          setImgExt(".png");
        } else {
          setImgError(true);
        }
      }}
    />
  );
}

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineAPI.getAll({ name: search || undefined });
      setMedicines(res.data);
    } catch {
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setSelectedFile(null);
    setShowModal(true);
  };
  const openEdit = (m) => {
    setForm({
      mName: m.mName,
      mPrice: m.mPrice,
      mUnit: m.mUnit,
      mCategory: m.mCategory,
      mImage: m.mImage || "",
    });
    setEditing(m.mId);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("mName", form.mName);
        formData.append("mPrice", parseInt(form.mPrice) || 0);
        formData.append("mUnit", parseInt(form.mUnit) || 1);
        formData.append("mCategory", form.mCategory);
        formData.append("image", selectedFile);

        if (editing) await medicineAPI.updateWithImage(editing, formData);
        else await medicineAPI.createWithImage(formData);
      } else {
        const payload = {
          ...form,
          mPrice: parseInt(form.mPrice),
          mUnit: parseInt(form.mUnit),
        };
        if (editing) await medicineAPI.update(editing, payload);
        else await medicineAPI.create(payload);
      }

      toast.success(`Medicine ${editing ? "updated" : "added"}!`);
      setShowModal(false);
      fetchMedicines();
    } catch (e) {
      console.error("Save Error:", e);
      const msg = e.response?.data?.message || e.response?.data || e.message || "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await medicineAPI.delete(id);
      toast.success("Medicine deleted");
      fetchMedicines();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = medicines.filter((m) =>
    m.mName.toLowerCase().includes(search.toLowerCase()) ||
    m.mCategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-transition px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h1 className="text-2xl font-black text-slate-900">
          Medicine Management
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchMedicines()}
              placeholder="Search medicines..."
              className="bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-4 focus:ring-primary-500/10 w-56 transition-all"
            />
          </div>
          <button
            onClick={openAdd}
            className="btn-primary py-3 px-6 flex items-center gap-2"
          >
            <FiPlus className="text-lg" />{" "}
            <span className="hidden sm:inline">Add Medicine</span>
          </button>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">
                  Medicine
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">
                  Price
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">
                  Unit
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-6">
                        <div className="h-10 bg-slate-50 rounded-2xl" />
                      </td>
                    </tr>
                  ))
                : filtered.map((m) => (
                    <tr
                      key={m.mId}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 p-1.5 shadow-sm">
                            {m.mImage ? (
                              <MedicineImage m={m} />
                            ) : (
                              <div className="w-full h-full bg-primary-50 rounded-lg flex items-center justify-center text-lg">
                                💊
                              </div>
                            )}
                          </div>
                          <p className="font-black text-slate-900 text-sm">
                            {m.mName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {m.mCategory}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-black text-slate-900">
                        ₹{m.mPrice}
                      </td>
                      <td className="px-6 py-5 text-slate-600 font-medium">
                        {m.mUnit}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(m)}
                            className="p-2.5 bg-white border border-slate-100 rounded-xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(m.mId)}
                            className="p-2.5 bg-white border border-slate-100 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full md:w-1/2 bg-white h-full shadow-2xl flex flex-col">
            <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                {editing ? "Edit Medicine" : "Add Medicine"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <form
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-8 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Medicine Name
                </label>
                <input
                  required
                  maxLength={20}
                  value={form.mName}
                  onChange={(e) => setForm({ ...form, mName: e.target.value })}
                  placeholder="e.g. Paracetamol"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Category
                </label>
                <input
                  required
                  maxLength={15}
                  value={form.mCategory}
                  onChange={(e) =>
                    setForm({ ...form, mCategory: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Price (₹)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.mPrice}
                    onChange={(e) =>
                      setForm({ ...form, mPrice: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Unit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.mUnit}
                    onChange={(e) =>
                      setForm({ ...form, mUnit: e.target.value })
                    }
                    placeholder="e.g. 10 (tabs)"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Medicine Image
                </label>
                <div className="flex flex-col gap-4">
                  { (form.mImage || selectedFile) && (
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 overflow-hidden">
                      <img 
                        src={selectedFile ? URL.createObjectURL(selectedFile) : form.mImage} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-slate-900 file:text-white hover:file:bg-primary-600 transition-all cursor-pointer"
                  />
                  {!selectedFile && (
                    <p className="text-[10px] text-slate-400 italic">
                      Current: {form.mImage || "No image set"}
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] btn-primary py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20"
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Update Medicine"
                      : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
