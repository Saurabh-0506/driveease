import { create } from 'zustand'
import {
  liveSessionsSeed,
  parkingBookingsSeed,
  parkingLotsSeed,
  paymentFeedSeed,
} from '../data/parkingSeed'

const USERS_STORAGE_KEY = 'driveease-users'
const AUTH_STORAGE_KEY = 'driveease-auth'

const demoUsers = [
  { id: 'u-1', name: 'Ava Carter', email: 'user@driveease.app', password: 'User@1234', role: 'user' },
  { id: 'a-1', name: 'Maya Admin', email: 'admin@driveease.app', password: 'Admin@1234', role: 'admin' },
  { id: 'v-1', name: 'Noah Vendor', email: 'vendor@driveease.app', password: 'Vendor@1234', role: 'vendor' },
]

const emptyAuth = { isAuthenticated: false, role: null, name: '', email: '' }

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
    return emptyAuth
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return emptyAuth
  }

  try {
    const parsed = JSON.parse(raw)
    if (!parsed?.isAuthenticated) {
      return emptyAuth
    }
    return {
      isAuthenticated: true,
      role: parsed.role,
      name: parsed.name,
      email: parsed.email,
    }
  } catch {
    return emptyAuth
  }
}

function saveAuth(auth) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

function resolveLotStatus(availableSlots, totalSlots) {
  const ratio = availableSlots / totalSlots

  if (ratio <= 0.08) {
    return 'Full'
  }

  if (ratio <= 0.18) {
    return 'Limited'
  }

  return 'Open'
}

function createSlotLabel(lot) {
  const slotNumber = String(Math.max(lot.availableSlots, 1)).padStart(3, '0')
  return `${lot.zone}-${slotNumber}`
}

function createQrToken(bookingId, vehicleNumber) {
  const suffix = vehicleNumber.replaceAll(' ', '').slice(-4).toUpperCase()
  return `QR-${bookingId}-${suffix}`
}

export const useAppStore = create((set) => ({
  auth: loadAuth(),
  users: loadUsers(),
  bookingDraft: {
    lotId: parkingLotsSeed[0]?.id ?? '',
    startTime: '2026-04-28T19:00',
    durationHours: 2,
    vehicleNumber: '',
    vehicleType: 'Sedan',
    addOns: [],
    paymentMethod: '',
    paymentReference: '',
  },
  websocketConnected: false,
  parkingLots: parkingLotsSeed,
  parkingBookings: parkingBookingsSeed,
  liveSessions: liveSessionsSeed,
  paymentFeed: paymentFeedSeed,
  signIn: ({ email, password }) => {
    let result = { success: false, reason: 'not_found' }

    set((state) => {
      const user = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        return state
      }

      if (user.password !== password) {
        result = { success: false, reason: 'invalid_password' }
        return state
      }

      result = { success: true, reason: null }
      const auth = {
        isAuthenticated: true,
        role: user.role,
        name: user.name,
        email: user.email,
      }

      saveAuth(auth)
      return { auth }
    })

    return result
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
      const auth = emptyAuth
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
        lotId: parkingLotsSeed[0]?.id ?? '',
        startTime: '2026-04-28T19:00',
        durationHours: 2,
        vehicleNumber: '',
        vehicleType: 'Sedan',
        addOns: [],
        paymentMethod: '',
        paymentReference: '',
      },
    }),
  setWebsocketConnected: (connected) => set({ websocketConnected: connected }),
  createParkingBooking: (payload) =>
    set((state) => {
      const selectedLot = state.parkingLots.find((lot) => lot.id === payload.lotId)
      if (!selectedLot || selectedLot.availableSlots <= 0) {
        return state
      }

      const bookingId = `PK-${Date.now().toString().slice(-4)}`
      const amount = selectedLot.pricePerHour * Number(payload.durationHours || 1)
      const slotLabel = createSlotLabel(selectedLot)
      const qrToken = createQrToken(bookingId, payload.vehicleNumber)
      const booking = {
        id: bookingId,
        lotId: selectedLot.id,
        lotName: selectedLot.name,
        vehicleNumber: payload.vehicleNumber,
        slotLabel,
        startTime: payload.startTime,
        durationHours: Number(payload.durationHours),
        amount,
        paymentMethod: payload.paymentMethod,
        paymentStatus: 'Paid',
        status: 'Reserved',
        qrToken,
      }
      const payment = {
        id: `PAY-${Date.now().toString().slice(-5)}`,
        bookingId,
        gateway: payload.paymentMethod,
        amount,
        status: 'Captured',
      }
      const session = {
        id: `SESS-${Date.now().toString().slice(-3)}`,
        bookingId,
        lotId: selectedLot.id,
        lotName: selectedLot.name,
        vehicleNumber: payload.vehicleNumber,
        slotLabel,
        checkpoint: 'Route optimized to gate',
        etaMinutes: 12,
        stage: 'Approaching',
      }

      return {
        parkingBookings: [booking, ...state.parkingBookings],
        paymentFeed: [payment, ...state.paymentFeed],
        liveSessions: [session, ...state.liveSessions],
        parkingLots: state.parkingLots.map((lot) =>
          lot.id === selectedLot.id
            ? {
                ...lot,
                availableSlots: Math.max(lot.availableSlots - 1, 0),
                status: resolveLotStatus(Math.max(lot.availableSlots - 1, 0), lot.totalSlots),
              }
            : lot,
        ),
      }
    }),
  updateBookingStatus: (bookingId, nextStatus) =>
    set((state) => ({
      parkingBookings: state.parkingBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: nextStatus } : booking,
      ),
    })),
  simulateRealtimeTick: () =>
    set((state) => {
      const parkingLots = state.parkingLots.map((lot, index) => {
        const direction = index % 2 === 0 ? -1 : 1
        const nextAvailable = Math.min(
          lot.totalSlots,
          Math.max(0, lot.availableSlots + direction * ((Date.now() + index) % 2 === 0 ? 1 : 2)),
        )

        return {
          ...lot,
          availableSlots: nextAvailable,
          status: resolveLotStatus(nextAvailable, lot.totalSlots),
        }
      })

      const liveSessions = state.liveSessions.map((session, index) => {
        if (session.stage === 'Parked') {
          return session
        }

        const nextEta = Math.max(0, session.etaMinutes - (index % 2 === 0 ? 2 : 1))
        const stage = nextEta === 0 ? 'Gate Ready' : session.stage
        const checkpoint = nextEta === 0 ? 'QR verified at boom barrier' : session.checkpoint

        return {
          ...session,
          etaMinutes: nextEta,
          stage,
          checkpoint,
        }
      })

      const parkingBookings = state.parkingBookings.map((booking) => {
        const session = liveSessions.find((item) => item.bookingId === booking.id)

        if (!session) {
          return booking
        }

        if (session.stage === 'Parked' && booking.status !== 'Checked In') {
          return { ...booking, status: 'Checked In' }
        }

        if (session.stage === 'Gate Ready' && booking.status === 'Reserved') {
          return { ...booking, status: 'Gate Ready' }
        }

        return booking
      })

      return {
        parkingLots,
        liveSessions,
        parkingBookings,
      }
    }),
}))
