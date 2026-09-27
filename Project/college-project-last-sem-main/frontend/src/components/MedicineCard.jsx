import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";
import { useState } from "react";

export default function MedicineCard({ medicine }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      addToCart(medicine, 1);
      toast.success(`${medicine.mName} added to cart!`);
    } catch {
      toast.error("Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  const [imgError, setImgError] = useState(false);
  const [imgExt, setImgExt] = useState(".jpg");

  return (
    <Link
      to={`/medicines/${medicine.mId}`}
      className="card-premium group flex flex-col page-transition"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-50/50 flex items-center justify-center p-6 overflow-hidden">
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
            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => {
              if (imgExt === ".jpg") {
                setImgExt(".png");
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-700">
            💊
          </span>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
            {medicine.mCategory}
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
          {medicine.mName}
        </h3>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none">
              ₹{medicine.mPrice}
            </span>
            {medicine.mUnit && (
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                per {medicine.mUnit} units
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-primary-600 hover:scale-110 transition-all duration-300 shadow-lg disabled:opacity-30 disabled:hover:scale-100"
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
            ) : (
              <FiShoppingCart className="text-lg" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
