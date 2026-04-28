import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Input } from '../../components/common'
import { useAppStore } from '../../store/useAppStore'

export default function LoginPage() {
  const location = useLocation()
  const prefilledEmail = location.state?.registeredEmail ?? location.state?.prefillEmail ?? ''
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: prefilledEmail,
      password: '',
    },
  })
  const signIn = useAppStore((state) => state.signIn)
  const auth = useAppStore((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    reset({
      email: prefilledEmail,
      password: '',
    })
  }, [prefilledEmail, reset])

  if (auth.isAuthenticated) {
    const start = auth.role === 'user' ? '/user/landing' : `/${auth.role}/dashboard`
    return <Navigate to={start} replace />
  }

  const onSubmit = (values) => {
    const result = signIn(values)
    if (!result.success) {
      if (result.reason === 'not_found') {
        toast.error('No account found. Please register first.')
        navigate('/signup', {
          state: {
            prefillEmail: values.email,
          },
        })
        return
      }

      toast.error('Incorrect password. Please try again.')
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
              DriveEase SmartPark
            </p>
            <h1 className="font-heading text-4xl font-bold">Industry-Grade Smart Parking Operations</h1>
            <p className="mt-4 text-slate-300">
              Explore driver, control-center, and operator experiences with live slot availability, QR entry, payment rails, and tracking telemetry.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Live parking occupancy</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">QR access control</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Payment gateway flows</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Vehicle tracking states</div>
            </div>
          </div>

          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-card border border-slate-700 bg-deepNavy/70 p-6">
            <input
              aria-hidden="true"
              autoComplete="username"
              className="hidden"
              name="fakeUsername"
              tabIndex={-1}
              type="text"
            />
            <input
              aria-hidden="true"
              autoComplete="current-password"
              className="hidden"
              name="fakePassword"
              tabIndex={-1}
              type="password"
            />
            <h2 className="font-heading text-2xl font-bold">Sign In</h2>
            <div className="rounded-control border border-blue-400/20 bg-blue-400/10 p-3 text-sm text-blue-100">
              {location.state?.registeredEmail
                ? 'Account created successfully. Please log in with your new email and password.'
                : 'New user? Register first, then log in with your new account.'}
            </div>
            <Input
              label="Email"
              type="email"
              autoComplete="new-password"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <button className="w-full rounded-control bg-accentAmber px-4 py-2 font-semibold text-deepNavy transition hover:bg-amber-300" type="submit">
              Login
            </button>

            <p className="text-center text-sm text-slate-300">
              New to DriveEase SmartPark?{' '}
              <Link to="/signup" className="font-semibold text-blue-300 hover:text-blue-200">
                Register first
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
