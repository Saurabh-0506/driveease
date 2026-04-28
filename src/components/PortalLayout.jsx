import { Menu, X, LogOut } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminNav, userNav, vendorNav } from '../data/navigation'
import { useAppStore } from '../store/useAppStore'

const labels = {
  user: 'User Portal',
  admin: 'Admin Portal',
  vendor: 'Vendor Portal',
}

export default function PortalLayout({ role }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const auth = useAppStore((state) => state.auth)
  const logout = useAppStore((state) => state.logout)
  const navigate = useNavigate()

  const navItems = useMemo(() => {
    if (role === 'admin') return adminNav
    if (role === 'vendor') return vendorNav
    return userNav
  }, [role])

  return (
    <div className="flex min-h-screen bg-deepNavy text-white">
      <aside
        className={`fixed z-30 h-full border-r border-slate-700 bg-[#0B1228] p-3 transition-all md:static ${collapsed ? 'w-20' : 'w-72'} ${
          mobileOpen ? 'left-0' : '-left-80 md:left-0'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          {!collapsed ? <h2 className="font-heading text-xl font-bold">DriveEase</h2> : null}
          <button className="rounded-control p-2 hover:bg-slate-700" onClick={() => setCollapsed((prev) => !prev)}>
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {!collapsed ? <p className="mb-4 text-xs uppercase tracking-wide text-slate-400">{labels[role]}</p> : null}

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-control px-3 py-2 text-sm transition ${
                  isActive ? 'bg-electricBlue/20 text-blue-200 ring-1 ring-electricBlue/60' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={18} />
              {!collapsed ? <span>{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        {!collapsed ? (
          <div className="mt-6 space-y-2 border-t border-slate-700 pt-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-control border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
              onClick={() => {
                logout()
                toast.success('Logged out')
                navigate('/login')
              }}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        ) : null}
      </aside>

      <main className="w-full flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-700 bg-deepNavy/90 px-4 py-3 backdrop-blur md:px-6">
          <button className="rounded-control p-2 hover:bg-slate-700 md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>
          <div>
            <p className="text-sm text-slate-300">Welcome back</p>
            <p className="font-heading text-lg font-semibold">{auth.name || 'DriveEase User'}</p>
          </div>
          <div className="rounded-control border border-slate-600 bg-slate-800/60 px-3 py-1 text-xs">{labels[role]}</div>
        </header>

        <div className="min-h-[calc(100vh-65px)] bg-hero-grid p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
