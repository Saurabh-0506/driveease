import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Input, Select } from '../../components/common'
import { useAppStore } from '../../store/useAppStore'

export default function SignupPage() {
  const signUp = useAppStore((state) => state.signUp)
  const auth = useAppStore((state) => state.auth)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      password: '',
      confirmPassword: '',
    },
  })

  if (auth.isAuthenticated) {
    const start = auth.role === 'user' ? '/user/landing' : `/${auth.role}/dashboard`
    return <Navigate to={start} replace />
  }

  const onSubmit = (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const created = signUp({
      name: values.name,
      email: values.email,
      role: values.role,
      password: values.password,
    })

    if (!created) {
      toast.error('An account with this email already exists')
      return
    }

    toast.success('Account created. Please sign in.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-hero-grid px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl rounded-card border border-slate-700 bg-surface/60 p-8 shadow-card">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-electricBlue/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
              DriveEase Platform
            </p>
            <h1 className="font-heading text-4xl font-bold">Create Your DriveEase Account</h1>
            <p className="mt-4 text-slate-300">
              Register as a user, admin, or vendor to access your dedicated portal experience.
            </p>
            <div className="mt-8 rounded-card border border-slate-700 bg-deepNavy p-4 text-sm text-slate-300">
              Signup is stored in local browser storage for this UI demo.
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-card border border-slate-700 bg-deepNavy/70 p-6">
            <h2 className="font-heading text-2xl font-bold">Sign Up</h2>

            <Input
              label="Full Name"
              placeholder="Your full name"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />

            <Select label="Account Type" error={errors.role?.message} {...register('role', { required: 'Account type is required' })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
            </Select>

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Use at least 8 characters' },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
              })}
            />

            <button className="w-full rounded-control bg-accentAmber px-4 py-2 font-semibold text-deepNavy transition hover:bg-amber-300" type="submit">
              Create Account
            </button>

            <p className="text-center text-sm text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-300 hover:text-blue-200">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
