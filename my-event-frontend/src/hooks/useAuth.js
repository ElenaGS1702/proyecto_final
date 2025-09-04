import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as api from '../services/api'

const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,

      isAuthenticated: () => Boolean(get().token),

      login: async (credentials) => {
        const res = await api.login(credentials)
        set({ token: res?.accessToken, refreshToken: res?.refreshToken, user: res?.user })
        return res
      },

      register: async (payload) => {
        const res = await api.register(payload)
        set({ token: res?.accessToken, refreshToken: res?.refreshToken, user: res?.user })
        return res
      },

      loadMe: async () => {
        const res = await api.me()
        if (res?.user) set({ user: res.user })
        return res
      },

      logout: () => set({ token: null, refreshToken: null, user: null }),
    }),
    {
      name: 'quickpass-auth',
      partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken, user: s.user })
    }
  )
)

export default useAuth
