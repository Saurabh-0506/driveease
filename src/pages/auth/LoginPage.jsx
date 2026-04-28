import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Input } from '../../components/common'
import { useAppStore } from '../../store/useAppStore'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'user@driveease.app',
      password: 'User@1234',
    },
  })
  const signIn = useAppStore((state) => state.signIn)
  const auth = useAppStore((state) => state.auth)
  const navigate = useNavigate()

  if (auth.isAuthenticated) {
    const start = auth.role === 'user' ? '/user/landing' : `/${auth.role}/dashboard`
    return <Navigate to={start} replace />
  }

  const onSubmit = (values) => {
    const success = signIn(values)
    if (!success) {
      toast.error('Invalid email or password')
      return
    }

    const auth = useAppStore.getState().auth
    const start = auth.role === 'user' ? '/user/landing' : `/${auth.role}/dashboard`
    toast.success(`Signed in as ${auth.role}`)
    navigate(start)
  }

  return (
    <div className="min-h-screen bg-hero-grid px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl rounded-card border border-slate-700 bg-surface/60 p-8 shadow-card">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-electricBlue/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
              DriveEase Platform
            </p>
            <h1 className="font-heading text-4xl font-bold">Premium Car Rental Operations, Unified</h1>
            <p className="mt-4 text-slate-300">
              Explore user, admin, and vendor experiences with role-based routing, smart booking flows, analytics, and polished SaaS visuals.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Collapsible sidebars</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Charts + skeleton loaders</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">React Hook Form validation</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Toast action feedback</div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-card border border-slate-700 bg-deepNavy/70 p-6">
            <h2 className="font-heading text-2xl font-bold">Sign In</h2>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <button className="w-full rounded-control bg-accentAmber px-4 py-2 font-semibold text-deepNavy transition hover:bg-amber-300" type="submit">
              Login
            </button>

            <p className="text-center text-sm text-slate-300">
              New to DriveEase?{' '}
              <Link to="/signup" className="font-semibold text-blue-300 hover:text-blue-200">
                Create an account
              </Link>
            </p>

            <div className="rounded-control border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300">
              Demo accounts: user@driveease.app / User@1234, admin@driveease.app / Admin@1234, vendor@driveease.app / Vendor@1234
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
