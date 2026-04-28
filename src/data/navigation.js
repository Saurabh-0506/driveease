import {
  CalendarDays,
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
  { to: '/user/landing', label: 'Live Search', icon: LayoutDashboard },
  { to: '/user/browse', label: 'Browse Hubs', icon: Search },
  { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/user/bookings', label: 'My Parking', icon: CalendarDays },
  { to: '/user/profile', label: 'Profile', icon: User },
]

export const adminNav = [
  { to: '/admin/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Drivers', icon: Users },
  { to: '/admin/vendors', label: 'Operators', icon: ShieldCheck },
  { to: '/admin/fleet', label: 'Infrastructure', icon: Search },
  { to: '/admin/bookings', label: 'Reservations', icon: CalendarDays },
  { to: '/admin/revenue', label: 'Revenue', icon: CircleDollarSign },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export const vendorNav = [
  { to: '/vendor/dashboard', label: 'Operations', icon: LayoutDashboard },
  { to: '/vendor/cars', label: 'Facilities', icon: Search },
  { to: '/vendor/bookings', label: 'Entries', icon: CalendarDays },
  { to: '/vendor/earnings', label: 'Earnings', icon: Wallet },
  { to: '/vendor/profile', label: 'Operator Profile', icon: User },
]
