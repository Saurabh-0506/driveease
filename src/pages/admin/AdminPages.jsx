import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button, Card, Input, PageShell, Select, StatusTag } from '../../components/common'
import { useLiveParkingSync } from '../../hooks/useLiveParkingSync'
import { useMockFetch } from '../../hooks/useMockFetch'
import { useAppStore } from '../../store/useAppStore'

export function AdminDashboardPage() {
  useLiveParkingSync()
  const parkingLots = useAppStore((state) => state.parkingLots)
  const parkingBookings = useAppStore((state) => state.parkingBookings)
  const liveSessions = useAppStore((state) => state.liveSessions)
  const paymentFeed = useAppStore((state) => state.paymentFeed)
  const { data: revenue } = useMockFetch('/mock/revenue.json', [])

  const totalSlots = parkingLots.reduce((sum, lot) => sum + lot.totalSlots, 0)
  const availableSlots = parkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0)
  const occupancy = totalSlots ? Math.round(((totalSlots - availableSlots) / totalSlots) * 100) : 0
  const gatewayMix = useMemo(() => {
    const mix = paymentFeed.reduce((acc, payment) => {
      acc[payment.gateway] = (acc[payment.gateway] || 0) + payment.amount
      return acc
    }, {})

    return Object.entries(mix).map(([name, value]) => ({ name, value }))
  }, [paymentFeed])

  return (
    <PageShell title="Platform Command Center" subtitle="Monitor occupancy, payment capture, and gate health across the live parking network.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-300">Network Occupancy</p><p className="font-heading text-2xl">{occupancy}%</p></Card>
        <Card><p className="text-sm text-slate-300">Live Bookings</p><p className="font-heading text-2xl">{parkingBookings.length}</p></Card>
        <Card><p className="text-sm text-slate-300">Approaching Vehicles</p><p className="font-heading text-2xl">{liveSessions.filter((item) => item.stage === 'Approaching').length}</p></Card>
        <Card><p className="text-sm text-slate-300">Payments Captured</p><p className="font-heading text-2xl">Rs {paymentFeed.reduce((sum, item) => sum + item.amount, 0)}</p></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-heading text-lg">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#22d3ee" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-heading text-lg">Payment Gateway Mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gatewayMix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>
                  {gatewayMix.map((entry, index) => (
                    <Cell key={entry.name} fill={['#22d3ee', '#2563eb', '#f59e0b'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <Card>
        <h3 className="font-heading text-lg">Live Hub Health</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {parkingLots.map((lot) => (
            <div key={lot.id} className="rounded-control border border-slate-700 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <p>{lot.name}</p>
                <StatusTag value={lot.status} />
              </div>
              <p className="mt-2 text-slate-300">{lot.availableSlots} slots open</p>
              <p className="text-slate-400">Entry: {lot.entryGate}</p>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  )
}

export function AdminUsersPage() {
  const { data: users, loading } = useMockFetch('/mock/users.json', [])

  return (
    <PageShell title="Driver Accounts" subtitle="Search users, inspect parking activity, and manage access controls.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Input label="Search" placeholder="Name or email" />
        <Select label="Status"><option>All</option><option>Active</option><option>Suspended</option></Select>
        <Select label="Usage"><option>Any</option><option>Frequent</option><option>New</option></Select>
        <Button className="self-end" variant="amber">Apply Filters</Button>
      </Card>
      <Card>
        {loading ? <p className="text-sm text-slate-400">Loading drivers...</p> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">Driver</th><th>Email</th><th>Trips</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-700">
                    <td className="py-3">{user.name}</td><td>{user.email}</td><td>{user.bookingCount}</td><td>{user.status}</td>
                    <td>
                      <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.success(`Driver ${user.status === 'Active' ? 'suspended' : 'activated'}`)}>
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
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

export function AdminVendorsPage() {
  const { data: vendors, loading } = useMockFetch('/mock/vendors.json', [])

  return (
    <PageShell title="Facility Operators" subtitle="Approve operators, validate infrastructure, and enforce compliance.">
      <Card>
        {loading ? <p className="text-sm text-slate-400">Loading operators...</p> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">Operator</th><th>Sites</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-slate-700">
                    <td className="py-3">{vendor.name}</td><td>{vendor.listings}</td><td>{vendor.status}</td>
                    <td className="space-x-2">
                      <Button className="px-3 py-1 text-xs" onClick={() => toast.success('Operator approved')}>Approve</Button>
                      <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.error('Operator rejected')}>Reject</Button>
                      <Button className="px-3 py-1 text-xs" variant="ghost">Flag Audit</Button>
                    </td>
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

export function AdminFleetPage() {
  useLiveParkingSync()
  const parkingLots = useAppStore((state) => state.parkingLots)

  return (
    <PageShell title="Parking Infrastructure" subtitle="Manage capacity, tariff bands, and monitoring readiness for each facility.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Select label="Status"><option>All</option><option>Open</option><option>Limited</option><option>Full</option></Select>
        <Select label="Demand"><option>Any</option><option>Balanced</option><option>High</option><option>Peak</option></Select>
        <Input label="Search Site" placeholder="Hub or area" />
        <Button className="self-end">Filter</Button>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2">Hub</th><th>Slots</th><th>Tariff</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {parkingLots.map((lot) => (
                <tr key={lot.id} className="border-t border-slate-700">
                  <td className="py-3">{lot.name}</td>
                  <td>{lot.availableSlots} / {lot.totalSlots}</td>
                  <td>Rs {lot.pricePerHour} / hr</td>
                  <td><StatusTag value={lot.status} /></td>
                  <td className="space-x-2">
                    <Button className="px-3 py-1 text-xs" variant="ghost">Adjust Tariff</Button>
                    <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.success('Maintenance workflow opened')}>Maintenance</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  )
}

export function AdminBookingsPage() {
  useLiveParkingSync()
  const parkingBookings = useAppStore((state) => state.parkingBookings)
  const updateBookingStatus = useAppStore((state) => state.updateBookingStatus)

  return (
    <PageShell title="Reservations & Entries" subtitle="Filter bookings by status, inspect QR access, and resolve gate issues quickly.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Select label="Status"><option>All</option><option>Reserved</option><option>Gate Ready</option><option>Checked In</option></Select>
        <Input label="From" type="date" />
        <Input label="To" type="date" />
        <Button className="self-end" variant="amber">Apply</Button>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2">Booking ID</th><th>Hub</th><th>Vehicle</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {parkingBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-700">
                  <td className="py-3">{booking.id}</td><td>{booking.lotName}</td><td>{booking.vehicleNumber}</td><td><StatusTag value={booking.status} /></td>
                  <td className="space-x-2">
                    <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => updateBookingStatus(booking.id, 'Checked In')}>
                      Force Check-In
                    </Button>
                    <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.error(`Gate incident logged for ${booking.id}`)}>
                      Raise Incident
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  )
}

export function AdminRevenuePage() {
  useLiveParkingSync()
  const paymentFeed = useAppStore((state) => state.paymentFeed)
  const chartData = useMemo(
    () =>
      paymentFeed.map((payment, index) => ({
        name: payment.gateway,
        amount: payment.amount,
        seq: index + 1,
      })),
    [paymentFeed],
  )

  return (
    <PageShell title="Revenue & Gateway Analytics" subtitle="Track payment capture, settlements, and operator payout readiness.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Input label="Start Date" type="date" />
        <Input label="End Date" type="date" />
        <Select label="Gateway"><option>All Gateways</option><option>UPI</option><option>Stripe</option><option>Razorpay</option></Select>
        <Button className="self-end" variant="amber" onClick={() => toast.success('Settlement export queued')}>
          Export CSV
        </Button>
      </Card>
      <Card>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="seq" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </PageShell>
  )
}

export function AdminSettingsPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      commission: 12,
      alertThreshold: 18,
      paymentGateway: 'Razorpay',
      qrExpiry: 20,
    },
  })

  return (
    <PageShell title="Platform Settings" subtitle="Configure pricing policy, gateway defaults, QR validity, and occupancy alerts.">
      <Card>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(() => toast.success('Platform settings saved'))}>
          <Input label="Commission Rate (%)" type="number" {...register('commission')} />
          <Input label="Low Availability Alert (%)" type="number" {...register('alertThreshold')} />
          <Select label="Default Payment Gateway" {...register('paymentGateway')}>
            <option>Razorpay</option>
            <option>Stripe</option>
            <option>UPI</option>
          </Select>
          <Input label="QR Expiry (minutes)" type="number" {...register('qrExpiry')} />
          <Button className="md:col-span-2" variant="amber" type="submit">Save Platform Settings</Button>
        </form>
      </Card>
    </PageShell>
  )
}
