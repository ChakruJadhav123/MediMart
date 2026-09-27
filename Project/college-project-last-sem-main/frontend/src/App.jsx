import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ErrorBoundary from './components/ErrorBoundary'

import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import AIChatbot     from './components/AIChatbot'

import Home          from './pages/Home'
import Medicines     from './pages/Medicines'
import MedicineDetail from './pages/MedicineDetail'
import Cart          from './pages/Cart'
import Checkout      from './pages/Checkout'
import Orders        from './pages/Orders'
import OrderDetail   from './pages/OrderDetail'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Profile       from './pages/Profile'
import About         from './pages/About'
import Contact       from './pages/Contact'

import AdminLayout        from './pages/admin/AdminLayout'
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminMedicines     from './pages/admin/AdminMedicines'
import AdminOrders        from './pages/admin/AdminOrders'
import AdminUsers         from './pages/admin/AdminUsers'
import AdminPayments      from './pages/admin/AdminPayments'
import AdminChatbot       from './pages/admin/AdminChatbot'
import AdminProfile       from './pages/admin/AdminProfile'
import PaymentHistory     from './pages/PaymentHistory'
import PaymentSuccess      from './pages/PaymentSuccess'
import Invoice             from './pages/Invoice'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
  </div>
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatbot />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" toastOptions={{ className:'text-sm font-medium', duration:3000 }}/>
            <Routes>
            {/* Public */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/medicines" element={<Layout><Medicines /></Layout>} />
            <Route path="/medicines/:id" element={<Layout><MedicineDetail /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/cart" element={<PrivateRoute><Layout><Cart /></Layout></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Layout><Checkout /></Layout></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Layout><Orders /></Layout></PrivateRoute>} />
            <Route path="/orders/:id" element={<PrivateRoute><Layout><OrderDetail /></Layout></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><Layout><PaymentHistory /></Layout></PrivateRoute>} />
            <Route path="/payment-success" element={<PrivateRoute><Layout><PaymentSuccess /></Layout></PrivateRoute>} />
            <Route path="/invoice" element={<PrivateRoute><Layout><Invoice /></Layout></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="medicines" element={<AdminMedicines />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="chatbot" element={<AdminChatbot />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
