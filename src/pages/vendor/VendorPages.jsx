import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button, Card, DataSkeleton, Input, PageShell, Select, StatusTag } from '../../components/common'
import { useMockFetch } from '../../hooks/useMockFetch'

export function VendorDashboardPage() {
  const { data: revenue, loading } = useMockFetch('/mock/revenue.json', [])

  return (
    <PageShell title="Vendor Dashboard" subtitle="Track earnings, fleet availability, and upcoming reservations.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Today</p><p className="font-heading text-2xl">$2,140</p></Card>
        <Card><p className="text-sm text-slate-300">This Week</p><p className="font-heading text-2xl">$11,920</p></Card>
        <Card><p className="text-sm text-slate-300">This Month</p><p className="font-heading text-2xl">$42,210</p></Card>
      </section>

      {loading ? <DataSkeleton rows={4} /> : null}
      {!loading ? (
        <Card>
          <h3 className="mb-3 font-heading text-lg">Earnings Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="vendorPayout" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}

      <Card>
        <h3 className="font-heading text-lg">Upcoming Bookings Feed</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>BMW X5 pickup today at 15:30 - John F.</li>
          <li>Tesla Model 3 pickup tomorrow at 10:00 - Priya K.</li>
        </ul>
      </Card>
    </PageShell>
  )
}

export function VendorCarsPage() {
  const { data: cars, loading } = useMockFetch('/mock/cars.json', [])
  const navigate = useNavigate()

  return (
    <PageShell
      title="My Cars"
      subtitle="Manage listings, availability, and statuses across your fleet."
      actions={<Button variant="amber" onClick={() => navigate('/vendor/cars/new')}>Add New Car</Button>}
    >
      {loading ? <DataSkeleton rows={6} /> : null}
      {!loading ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => (
            <Card key={car.id} className="space-y-3">
              <div className="h-36 rounded-control bg-gradient-to-br from-blue-600/40 to-slate-700" />
              <div className="flex items-start justify-between">
                <h3 className="font-heading text-lg">{car.name}</h3>
                <StatusTag value={car.status} />
              </div>
              <p className="text-sm text-slate-300">${car.pricePerDay}/day</p>
              <div className="flex gap-2">
                <Button className="w-full" variant="ghost" onClick={() => navigate(`/vendor/cars/${car.id}/edit`)}>Edit</Button>
                <Button className="w-full" variant="ghost" onClick={() => toast.error('Car listing deleted')}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </section>
      ) : null}
    </PageShell>
  )
}

export function VendorCarFormPage() {
  const { id } = useParams()
  const editing = Boolean(id)
  const [step, setStep] = useState(1)
  const { register, handleSubmit } = useForm()

  const submit = () => {
    if (step < 5) {
      setStep((prev) => prev + 1)
      toast.success(`Step ${step} saved`)
      return
    }
    toast.success(editing ? 'Car updated' : 'Car added')
  }

  return (
    <PageShell title={editing ? 'Edit Car' : 'Add New Car'} subtitle="Details -> Specs -> Photos -> Pricing -> Availability">
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {['Details', 'Specs', 'Photos', 'Pricing', 'Availability'].map((name, idx) => (
            <span key={name} className={`rounded-full px-3 py-1 ${step >= idx + 1 ? 'bg-electricBlue/25 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
              {idx + 1}. {name}
            </span>
          ))}
        </div>

        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(submit)}>
          {step === 1 ? (
            <>
              <Input label="Car Name" {...register('name', { required: true })} />
              <Input label="Brand" {...register('brand')} />
              <Input label="Model Year" type="number" {...register('year')} />
              <Select label="Type" {...register('type')}><option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Luxury</option></Select>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Input label="Seats" type="number" {...register('seats')} />
              <Select label="Transmission" {...register('transmission')}><option>Automatic</option><option>Manual</option></Select>
              <Select label="Fuel Type" {...register('fuel')}><option>Petrol</option><option>Diesel</option><option>EV</option></Select>
              <Input label="Features" placeholder="GPS, Sunroof, Parking Camera" {...register('features')} />
            </>
          ) : null}

          {step === 3 ? <Input label="Upload Car Images" type="file" multiple className="md:col-span-2" {...register('photos')} /> : null}

          {step === 4 ? (
            <>
              <Input label="Daily Price" type="number" {...register('dailyPrice')} />
              <Input label="Weekly Price" type="number" {...register('weeklyPrice')} />
              <Input label="Monthly Price" type="number" {...register('monthlyPrice')} />
              <Input label="Location" {...register('location')} />
            </>
          ) : null}

          {step === 5 ? (
            <>
              <Input label="Available From" type="date" {...register('availableFrom')} />
              <Input label="Available To" type="date" {...register('availableTo')} />
              <Select label="Status" {...register('status')}><option>available</option><option>maintenance</option></Select>
            </>
          ) : null}

          <Button className="md:col-span-2" variant="amber" type="submit">
            {step < 5 ? 'Save and Continue' : editing ? 'Update Car' : 'Publish Car'}
          </Button>
        </form>
      </Card>
    </PageShell>
  )
}

export function VendorBookingsPage() {
  const { data: bookings, loading } = useMockFetch('/mock/userBookings.json', [])

  const incoming = useMemo(() => bookings.filter((b) => b.status === 'Pending'), [bookings])

  return (
    <PageShell title="Bookings" subtitle="Review incoming requests, active rentals, and completed history.">
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-heading text-lg">Incoming Requests</h3>
          {loading ? <DataSkeleton rows={3} /> : null}
          {!loading ? (
            <div className="mt-3 space-y-3 text-sm">
              {incoming.map((item) => (
                <div key={item.id} className="rounded-control border border-slate-700 p-3">
                  <p>{item.id} - {item.car}</p>
                  <p className="text-slate-300">{item.dates}</p>
                  <div className="mt-2 flex gap-2">
                    <Button className="px-3 py-1 text-xs" onClick={() => toast.success('Booking accepted')}>Accept</Button>
                    <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.error('Booking rejected')}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        <Card>
          <h3 className="font-heading text-lg">Active and Past Rentals</h3>
          {loading ? <DataSkeleton rows={4} /> : null}
          {!loading ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {bookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between rounded-control border border-slate-700 px-3 py-2">
                  <span>{b.car}</span>
                  <StatusTag value={b.status} />
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </section>
    </PageShell>
  )
}

export function VendorEarningsPage() {
  const { data: revenue, loading } = useMockFetch('/mock/revenue.json', [])

  return (
    <PageShell title="Earnings" subtitle="Monitor transactions, payouts, and monthly totals.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Total Earnings</p><p className="font-heading text-2xl">$184,220</p></Card>
        <Card><p className="text-sm text-slate-300">Pending Payouts</p><p className="font-heading text-2xl">$9,430</p></Card>
        <Card><Button className="w-full" variant="amber" onClick={() => toast.success('Payout request submitted')}>Request Payout</Button></Card>
      </section>

      <Card>
        {loading ? <DataSkeleton rows={5} /> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">Month</th><th>Platform Revenue</th><th>Your Payout</th></tr></thead>
              <tbody>
                {revenue.map((row) => (
                  <tr key={row.month} className="border-t border-slate-700">
                    <td className="py-3">{row.month}</td><td>${row.amount.toLocaleString()}</td><td>${row.vendorPayout.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </PageShell>
  )
}

export function VendorProfilePage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      businessName: 'Urban Wheels Co.',
      contact: 'ops@urbanwheels.io',
      verified: true,
    },
  })

  return (
    <PageShell title="Profile & Verification" subtitle="Business details, document uploads, and verification badge status.">
      <Card>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(() => toast.success('Vendor profile updated'))}>
          <Input label="Business Name" {...register('businessName')} />
          <Input label="Contact Email" type="email" {...register('contact')} />
          <Input label="Upload License" type="file" {...register('licenseDoc')} />
          <Input label="Upload Registration" type="file" {...register('registrationDoc')} />
          <div className="md:col-span-2">
            <p className="text-sm">Verification Status: <span className="rounded-full bg-emerald-300/15 px-2 py-1 text-emerald-300">Verified</span></p>
          </div>
          <Button className="md:col-span-2" variant="amber" type="submit">Save Profile</Button>
        </form>
      </Card>
    </PageShell>
  )
}
