import {
  CalendarDays,
  Car,
  CircleDollarSign,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from 'lucide-react'

export const userNav = [
  { to: '/user/landing', label: 'Landing', icon: LayoutDashboard },
  { to: '/user/browse', label: 'Browse Cars', icon: Search },
  { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/user/bookings', label: 'My Bookings', icon: CalendarDays },
  { to: '/user/profile', label: 'Profile', icon: User },
]

export const adminNav = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/vendors', label: 'Vendors', icon: ShieldCheck },
  { to: '/admin/fleet', label: 'Car Fleet', icon: Car },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin/revenue', label: 'Revenue', icon: CircleDollarSign },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export const vendorNav = [
  { to: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vendor/cars', label: 'My Cars', icon: Car },
  { to: '/vendor/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/vendor/earnings', label: 'Earnings', icon: Wallet },
  { to: '/vendor/profile', label: 'Profile & Verify', icon: User },
]
