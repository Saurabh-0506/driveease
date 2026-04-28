import { create } from 'zustand'

const USERS_STORAGE_KEY = 'driveease-users'
const AUTH_STORAGE_KEY = 'driveease-auth'

const demoUsers = [
  { id: 'u-1', name: 'Ava Carter', email: 'user@driveease.app', password: 'User@1234', role: 'user' },
  { id: 'a-1', name: 'Maya Admin', email: 'admin@driveease.app', password: 'Admin@1234', role: 'admin' },
  { id: 'v-1', name: 'Noah Vendor', email: 'vendor@driveease.app', password: 'Vendor@1234', role: 'vendor' },
]

const hasWindow = typeof window !== 'undefined'

function loadUsers() {
  if (!hasWindow) {
    return demoUsers
  }

  const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers))
    return demoUsers
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : demoUsers
  } catch {
    return demoUsers
  }
}

function saveUsers(users) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function loadAuth() {
  if (!hasWindow) {
    return { isAuthenticated: false, role: null, name: '', email: '' }
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return { isAuthenticated: false, role: null, name: '', email: '' }
  }

  try {
    const parsed = JSON.parse(raw)
    if (!parsed?.isAuthenticated) {
      return { isAuthenticated: false, role: null, name: '', email: '' }
    }
    return {
      isAuthenticated: true,
      role: parsed.role,
      name: parsed.name,
      email: parsed.email,
    }
  } catch {
    return { isAuthenticated: false, role: null, name: '', email: '' }
  }
}

function saveAuth(auth) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

export const useAppStore = create((set) => ({
  auth: loadAuth(),
  users: loadUsers(),
  bookingDraft: {
    dates: '',
    pickup: '',
    extras: [],
    paymentMethod: '',
  },
  signIn: ({ email, password }) => {
    let signedIn = false

    set((state) => {
      const user = state.users.find(
        (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
      )

      if (!user) {
        return state
      }

      signedIn = true
      const auth = {
        isAuthenticated: true,
        role: user.role,
        name: user.name,
        email: user.email,
      }

      saveAuth(auth)
      return { auth }
    })

    return signedIn
  },
  signUp: ({ name, email, password, role }) => {
    let created = false

    set((state) => {
      const exists = state.users.some((item) => item.email.toLowerCase() === email.toLowerCase())
      if (exists) {
        return state
      }

      created = true
      const nextUsers = [
        ...state.users,
        {
          id: `u-${Date.now()}`,
          name,
          email,
          password,
          role,
        },
      ]

      saveUsers(nextUsers)
      return { users: nextUsers }
    })

    return created
  },
  logout: () =>
    set(() => {
      const auth = { isAuthenticated: false, role: null, name: '', email: '' }
      saveAuth(auth)
      return { auth }
    }),
  updateBookingDraft: (patch) =>
    set((state) => ({
      bookingDraft: { ...state.bookingDraft, ...patch },
    })),
  resetBookingDraft: () =>
    set({
      bookingDraft: {
        dates: '',
        pickup: '',
        extras: [],
        paymentMethod: '',
      },
    }),
}))
