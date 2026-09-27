import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (medicine, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.mId === medicine.mId)
      if (existing) {
        return prev.map(i => i.mId === medicine.mId ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { mId: medicine.mId, mName: medicine.mName, mPrice: medicine.mPrice, mImage: medicine.mImage, quantity }]
    })
  }

  const updateItem = (mId, quantity) => {
    if (quantity <= 0) { removeItem(mId); return }
    setCartItems(prev => prev.map(i => i.mId === mId ? { ...i, quantity } : i))
  }

  const removeItem = (mId) => {
    setCartItems(prev => prev.filter(i => i.mId !== mId))
  }

  const clearCart = () => setCartItems([])

  const totalAmount = cartItems.reduce((sum, i) => sum + (i.mPrice * i.quantity), 0)
  const cartCount   = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  const cart = {
    items: cartItems.map(i => ({ ...i, subtotal: i.mPrice * i.quantity })),
    totalAmount,
    totalItems: cartCount
  }

  return (
    <CartContext.Provider value={{ cart, cartItems, addToCart, updateItem, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
