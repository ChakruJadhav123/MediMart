import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
} from "react-icons/fi";
import toast from "react-hot-toast";

function CartItem({ item, handleRemove, handleUpdate }) {
  const [imgError, setImgError] = useState(false);
  const [imgExt, setImgExt] = useState(".jpg");

  return (
    <div className="card-premium p-6 flex gap-8 group">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          {(!imgError && (item.mImage || item.mName)) ? (
            <img
              src={
                item.mImage
                  ? item.mImage.startsWith("/")
                    ? item.mImage
                    : `/images/${item.mImage}`
                  : `/images/${item.mName}${imgExt}`
              }
              alt={item.mName}
              className="max-w-full max-h-full object-contain mix-blend-multiply"
              onError={() => {
                if (imgExt === ".jpg") {
                  setImgExt(".png");
                } else {
                  setImgError(true);
                }
              }}
            />
          ) : (
            <span className="text-4xl">💊</span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/medicines/${item.mId}`}
            className="text-lg font-black text-slate-900 hover:text-primary-600 transition-colors leading-tight block mb-1"
          >
            {item.mName}
          </Link>
          <p className="text-sm text-slate-400 font-medium">
            ₹{item.mPrice} each
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200/50">
            <button
              onClick={() =>
                item.quantity === 1
                  ? handleRemove(item.mId)
                  : handleUpdate(item.mId, item.quantity - 1)
              }
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white hover:text-rose-500 transition-all text-slate-400"
            >
              {item.quantity === 1 ? (
                <FiTrash2 className="text-sm" />
              ) : (
                <FiMinus className="text-sm" />
              )}
            </button>
            <span className="w-10 text-center text-sm font-black text-slate-900">
              {item.quantity}
            </span>
            <button
              onClick={() => handleUpdate(item.mId, item.quantity + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary-600 transition-all text-slate-400"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
              ₹{item.subtotal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const handleUpdate = (mId, qty) => {
    try {
      updateItem(mId, qty);
    } catch {
      toast.error("Error updating cart");
    }
  };

  const handleRemove = (mId) => {
    removeItem(mId);
    toast.success("Item removed");
  };

  const freeDelivery = cart.totalAmount >= 499;
  const delivery = freeDelivery ? 0 : 49;
  const grandTotal = cart.totalAmount + delivery;

  if (!cart.items?.length)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-2xl font-extrabold text-gray-800">
          Your cart is empty
        </h2>
        <p className="text-gray-500">
          Looks like you haven't added any medicines yet.
        </p>
        <Link to="/medicines" className="btn-primary flex items-center gap-2">
          <FiShoppingBag /> Shop Now
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 page-transition">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-8 bg-primary-500 rounded-full" />
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Your Cart
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
            Review items in your cart
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <CartItem key={item.mId} item={item} handleRemove={handleRemove} handleUpdate={handleUpdate} />
          ))}
        </div>

        {/* Summary */}
        <div className="relative">
          <div className="glass rounded-[2.5rem] p-8 sticky top-24 shadow-2xl shadow-slate-200/50 border border-white">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
              Order Summary
            </h3>

            <div className="space-y-6 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-bold text-slate-900">
                  ₹{cart.totalAmount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Delivery Fee
                </span>
                <span
                  className={`font-bold ${freeDelivery ? "text-emerald-500" : "text-slate-900"}`}
                >
                  {freeDelivery ? "FREE" : `₹${delivery}`}
                </span>
              </div>

              {!freeDelivery && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-start gap-3">
                  <FiTruck className="mt-1 shrink-0 text-primary-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Add ₹{499 - cart.totalAmount} more for FREE delivery
                  </p>
                </div>
              )}

              <div className="h-px bg-slate-100 my-6" />

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Total
                  </p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                    ₹{grandTotal}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn-primary w-full mt-10 py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30 group"
            >
              Proceed to Checkout{" "}
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>

            <Link
              to="/medicines"
              className="block text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 hover:text-primary-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
