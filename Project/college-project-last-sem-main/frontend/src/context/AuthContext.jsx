import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, profileAPI } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (token && stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.clear() }
    }
    setLoading(false)
  }, [])

  const login = async (loginId, password) => {
    const res = await authAPI.login({ loginId, password })
    const { token, ...userData } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res = await authAPI.register(data)
    return res.data
  }

  const sendRegistrationOtp = async (data) => {
    const res = await authAPI.sendRegistrationOtp(data)
    return res.data
  }

  const verifyRegistrationOtp = async (data) => {
    const res = await authAPI.verifyRegistrationOtp(data)
    return res.data
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await profileAPI.get()
      const profile = res.data
      const updated = { ...user, ...profile }
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, sendRegistrationOtp, verifyRegistrationOtp, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
