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
import { Button, Card, Input, PageShell, Select, StatusTag } from '../../components/common'
import { useLiveParkingSync } from '../../hooks/useLiveParkingSync'
import { useMockFetch } from '../../hooks/useMockFetch'
import { useAppStore } from '../../store/useAppStore'

export function VendorDashboardPage() {
  useLiveParkingSync()
  const parkingLots = useAppStore((state) => state.parkingLots)
  const liveSessions = useAppStore((state) => state.liveSessions)
  const { data: revenue } = useMockFetch('/mock/revenue.json', [])

  const totalAvailable = parkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0)

  return (
    <PageShell title="Facility Operations" subtitle="Track occupancy, entry queues, and payout performance across your managed parking sites.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Open Slots</p><p className="font-heading text-2xl">{totalAvailable}</p></Card>
        <Card><p className="text-sm text-slate-300">Approaching Vehicles</p><p className="font-heading text-2xl">{liveSessions.filter((item) => item.stage === 'Approaching').length}</p></Card>
        <Card><p className="text-sm text-slate-300">Gate-Ready Sessions</p><p className="font-heading text-2xl">{liveSessions.filter((item) => item.stage === 'Gate Ready').length}</p></Card>
      </section>

      <Card>
        <h3 className="mb-3 font-heading text-lg">Earnings Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="vendorPayout" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="font-heading text-lg">Live Entry Feed</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {liveSessions.slice(0, 4).map((session) => (
            <li key={session.id}>{session.vehicleNumber} at {session.lotName} - {session.checkpoint}</li>
          ))}
        </ul>
      </Card>
    </PageShell>
  )
}

export function VendorCarsPage() {
  useLiveParkingSync()
  const parkingLots = useAppStore((state) => state.parkingLots)
  const navigate = useNavigate()

  return (
    <PageShell
      title="Managed Facilities"
      subtitle="Update live capacity, tariffs, and gate readiness for each parking hub."
      actions={<Button variant="amber" onClick={() => navigate('/vendor/cars/new')}>Add New Facility</Button>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {parkingLots.map((lot) => (
          <Card key={lot.id} className="space-y-3">
            <div className="h-36 rounded-control bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.45),_transparent_35%),linear-gradient(135deg,rgba(37,99,235,0.35),rgba(15,23,42,0.95))]" />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-lg">{lot.name}</h3>
                <p className="text-sm text-slate-300">{lot.location}</p>
              </div>
              <StatusTag value={lot.status} />
            </div>
            <p className="text-sm text-slate-300">{lot.availableSlots} / {lot.totalSlots} slots available</p>
            <div className="flex gap-2">
              <Button className="w-full" variant="ghost" onClick={() => navigate(`/vendor/cars/${lot.id}/edit`)}>Edit</Button>
              <Button className="w-full" variant="ghost" onClick={() => toast.success('Capacity sync task queued')}>
                Sync Capacity
              </Button>
            </div>
          </Card>
        ))}
      </section>
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
    toast.success(editing ? 'Facility updated' : 'Facility added')
  }

  return (
    <PageShell title={editing ? 'Edit Facility' : 'Add New Facility'} subtitle="Identity -> Capacity -> Hardware -> Pricing -> Availability">
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {['Identity', 'Capacity', 'Hardware', 'Pricing', 'Availability'].map((name, idx) => (
            <span key={name} className={`rounded-full px-3 py-1 ${step >= idx + 1 ? 'bg-electricBlue/25 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
              {idx + 1}. {name}
            </span>
          ))}
        </div>

        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(submit)}>
          {step === 1 ? (
            <>
              <Input label="Facility Name" {...register('name', { required: true })} />
              <Input label="Location" {...register('location')} />
              <Input label="Zone Code" {...register('zone')} />
              <Select label="Site Type" {...register('type')}><option>Commercial</option><option>Airport</option><option>Residential</option></Select>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Input label="Total Slots" type="number" {...register('totalSlots')} />
              <Input label="Reserved EV Slots" type="number" {...register('evSlots')} />
              <Input label="Entry Gates" type="number" {...register('entryGates')} />
              <Input label="Exit Gates" type="number" {...register('exitGates')} />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Select label="Barrier Control" {...register('barrierControl')}><option>QR + ANPR</option><option>QR only</option><option>Manual assist</option></Select>
              <Input label="Camera Count" type="number" {...register('cameras')} />
              <Input label="IoT Sensor Vendor" {...register('sensorVendor')} />
              <Input label="Edge Gateway ID" {...register('gatewayId')} />
            </>
          ) : null}

          {step === 4 ? (
            <>
              <Input label="Base Hourly Price" type="number" {...register('hourlyPrice')} />
              <Input label="Peak Hour Price" type="number" {...register('peakPrice')} />
              <Input label="Overstay Fee" type="number" {...register('overstayFee')} />
              <Select label="Gateway" {...register('gateway')}><option>Razorpay</option><option>Stripe</option><option>UPI</option></Select>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <Input label="Open From" type="time" {...register('openFrom')} />
              <Input label="Open To" type="time" {...register('openTo')} />
              <Select label="Status" {...register('status')}><option>Open</option><option>Limited</option><option>Full</option></Select>
              <Select label="Manual Override" {...register('override')}><option>Disabled</option><option>Enabled</option></Select>
            </>
          ) : null}

          <Button className="md:col-span-2" variant="amber" type="submit">
            {step < 5 ? 'Save and Continue' : editing ? 'Update Facility' : 'Publish Facility'}
          </Button>
        </form>
      </Card>
    </PageShell>
  )
}

export function VendorBookingsPage() {
  useLiveParkingSync()
  const parkingBookings = useAppStore((state) => state.parkingBookings)
  const liveSessions = useAppStore((state) => state.liveSessions)

  const incoming = useMemo(() => parkingBookings.filter((booking) => booking.status === 'Reserved' || booking.status === 'Gate Ready'), [parkingBookings])

  return (
    <PageShell title="Reservations & Entries" subtitle="Review incoming vehicles, active sessions, and support-sensitive bookings.">
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-heading text-lg">Incoming Entries</h3>
          <div className="mt-3 space-y-3 text-sm">
            {incoming.map((item) => (
              <div key={item.id} className="rounded-control border border-slate-700 p-3">
                <p>{item.id} - {item.vehicleNumber}</p>
                <p className="text-slate-300">{item.lotName} | Slot {item.slotLabel}</p>
                <div className="mt-2 flex gap-2">
                  <Button className="px-3 py-1 text-xs" onClick={() => toast.success('QR validated for entry')}>Validate QR</Button>
                  <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.error('Manual lane assigned')}>Manual Assist</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-lg">Live Sessions</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {liveSessions.map((session) => (
              <li key={session.id} className="flex items-center justify-between rounded-control border border-slate-700 px-3 py-2">
                <span>{session.vehicleNumber}</span>
                <StatusTag value={session.stage} />
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </PageShell>
  )
}

export function VendorEarningsPage() {
  const { data: revenue } = useMockFetch('/mock/revenue.json', [])

  return (
    <PageShell title="Earnings & Payouts" subtitle="Monitor parking revenue, payout readiness, and settlement performance.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Total Earnings</p><p className="font-heading text-2xl">Rs 184220</p></Card>
        <Card><p className="text-sm text-slate-300">Pending Payouts</p><p className="font-heading text-2xl">Rs 9430</p></Card>
        <Card><Button className="w-full" variant="amber" onClick={() => toast.success('Payout request submitted')}>Request Payout</Button></Card>
      </section>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2">Month</th><th>Platform Revenue</th><th>Your Payout</th></tr></thead>
            <tbody>
              {revenue.map((row) => (
                <tr key={row.month} className="border-t border-slate-700">
                  <td className="py-3">{row.month}</td><td>Rs {row.amount.toLocaleString()}</td><td>Rs {row.vendorPayout.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      nocId: 'NOC-PLT-7781',
    },
  })

  return (
    <PageShell title="Operator Profile" subtitle="Business details, infra documents, and control-room verification state.">
      <Card>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(() => toast.success('Operator profile updated'))}>
          <Input label="Business Name" {...register('businessName')} />
          <Input label="Contact Email" type="email" {...register('contact')} />
          <Input label="Municipal NOC ID" {...register('nocId')} />
          <Input label="Upload Compliance Pack" type="file" {...register('complianceDoc')} />
          <div className="md:col-span-2">
            <p className="text-sm">Verification Status: <span className="rounded-full bg-emerald-300/15 px-2 py-1 text-emerald-300">Verified</span></p>
          </div>
          <Button className="md:col-span-2" variant="amber" type="submit">Save Profile</Button>
        </form>
      </Card>
    </PageShell>
  )
}
