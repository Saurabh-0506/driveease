import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button, Card, DataSkeleton, Input, PageShell, Select, StatusTag } from '../../components/common'
import { useMockFetch } from '../../hooks/useMockFetch'

export function AdminDashboardPage() {
  const { data: revenue, loading } = useMockFetch('/mock/revenue.json', [])
  const bookingBars = revenue.map((r) => ({ month: r.month, bookings: r.bookings }))

  return (
    <PageShell title="Dashboard Overview" subtitle="Real-time platform KPIs, revenue trends, and booking activity.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-300">Total Bookings</p><p className="font-heading text-2xl">12,482</p></Card>
        <Card><p className="text-sm text-slate-300">Revenue</p><p className="font-heading text-2xl">$1.48M</p></Card>
        <Card><p className="text-sm text-slate-300">Active Rentals</p><p className="font-heading text-2xl">328</p></Card>
        <Card><p className="text-sm text-slate-300">Users / Vendors</p><p className="font-heading text-2xl">9,140 / 322</p></Card>
      </section>

      {loading ? <DataSkeleton rows={5} /> : null}
      {!loading ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 font-heading text-lg">Monthly Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-heading text-lg">Bookings Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      ) : null}

      <Card>
        <h3 className="font-heading text-lg">Recent Activity</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>New vendor "MetroWheel" submitted verification documents.</li>
          <li>Booking #DE-1192 was force-cancelled by support.</li>
          <li>Commission update scheduled for next billing cycle.</li>
        </ul>
      </Card>
    </PageShell>
  )
}

export function AdminUsersPage() {
  const { data: users, loading } = useMockFetch('/mock/users.json', [])

  return (
    <PageShell title="User Management" subtitle="Search users, inspect booking activity, and control access.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Input label="Search" placeholder="Name or email" />
        <Select label="Status"><option>All</option><option>Active</option><option>Suspended</option></Select>
        <Select label="Bookings"><option>Any</option><option>0-5</option><option>6+</option></Select>
        <Button className="self-end" variant="amber">Apply Filters</Button>
      </Card>
      <Card>
        {loading ? <DataSkeleton rows={6} /> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">User</th><th>Email</th><th>Bookings</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-700">
                    <td className="py-3">{u.name}</td><td>{u.email}</td><td>{u.bookingCount}</td><td>{u.status}</td>
                    <td>
                      <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.success(`User ${u.status === 'Active' ? 'suspended' : 'activated'}`)}>
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
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
    <PageShell title="Vendor Management" subtitle="Approve applications, audit listings, and enforce compliance.">
      <Card>
        {loading ? <DataSkeleton rows={5} /> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">Vendor</th><th>Listings</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-t border-slate-700">
                    <td className="py-3">{v.name}</td><td>{v.listings}</td><td>{v.status}</td>
                    <td className="space-x-2">
                      <Button className="px-3 py-1 text-xs" onClick={() => toast.success('Vendor approved')}>Approve</Button>
                      <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.error('Vendor rejected')}>Reject</Button>
                      <Button className="px-3 py-1 text-xs" variant="ghost">Suspend</Button>
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
  const { data: cars, loading } = useMockFetch('/mock/cars.json', [])

  return (
    <PageShell title="Car Fleet Overview" subtitle="Manage all cars across vendors by availability state.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Select label="Status"><option>All</option><option>available</option><option>rented</option><option>maintenance</option></Select>
        <Select label="Vendor"><option>Any Vendor</option><option>Urban Wheels</option></Select>
        <Input label="Search Car" placeholder="Model name" />
        <Button className="self-end">Filter</Button>
      </Card>
      <Card>
        {loading ? <DataSkeleton rows={6} /> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">Car</th><th>Type</th><th>Price/Day</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="border-t border-slate-700">
                    <td className="py-3">{car.name}</td><td>{car.type}</td><td>${car.pricePerDay}</td><td><StatusTag value={car.status} /></td>
                    <td className="space-x-2">
                      <Button className="px-3 py-1 text-xs" variant="ghost">Edit</Button>
                      <Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.error('Car removed')}>Remove</Button>
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

export function AdminBookingsPage() {
  const { data: bookings, loading } = useMockFetch('/mock/userBookings.json', [])

  return (
    <PageShell title="Bookings Management" subtitle="Filter bookings by status, date, and vendor for rapid support actions.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Select label="Status"><option>All</option><option>Pending</option><option>Confirmed</option><option>Cancelled</option></Select>
        <Input label="From" type="date" />
        <Input label="To" type="date" />
        <Button className="self-end" variant="amber">Apply</Button>
      </Card>

      <Card>
        {loading ? <DataSkeleton rows={6} /> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">Booking ID</th><th>Car</th><th>Dates</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-slate-700">
                    <td className="py-3">{b.id}</td><td>{b.car}</td><td>{b.dates}</td><td><StatusTag value={b.status} /></td>
                    <td><Button className="px-3 py-1 text-xs" variant="ghost" onClick={() => toast.error('Booking force-cancelled')}>Force Cancel</Button></td>
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

export function AdminRevenuePage() {
  const { data: revenue, loading } = useMockFetch('/mock/revenue.json', [])

  return (
    <PageShell title="Revenue & Analytics" subtitle="Breakdowns by vendor and category with export-ready reporting.">
      <Card className="grid gap-3 md:grid-cols-4">
        <Input label="Start Date" type="date" />
        <Input label="End Date" type="date" />
        <Select label="Category"><option>All Categories</option><option>Economy</option><option>Luxury</option></Select>
        <Button className="self-end" variant="amber" onClick={() => toast.success('CSV export queued')}>
          Export CSV
        </Button>
      </Card>
      <Card>
        {loading ? <DataSkeleton rows={4} /> : null}
        {!loading ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#2563EB" />
                <Bar dataKey="vendorPayout" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </Card>
    </PageShell>
  )
}

export function AdminSettingsPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      commission: 12,
      locations: 'New York, Chicago, Austin',
      paymentGateway: 'Stripe',
    },
  })

  return (
    <PageShell title="Settings" subtitle="Platform commission, supported locations, and payment gateway configuration.">
      <Card>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(() => toast.success('Settings saved'))}>
          <Input label="Commission Rate (%)" type="number" {...register('commission')} />
          <Select label="Payment Gateway" {...register('paymentGateway')}>
            <option>Stripe</option>
            <option>Razorpay</option>
            <option>PayPal</option>
          </Select>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block text-slate-200">Supported Locations</span>
            <textarea className="w-full rounded-control border border-slate-600 bg-deepNavy px-3 py-2 text-white" rows="4" {...register('locations')} />
          </label>
          <Button className="md:col-span-2" variant="amber" type="submit">Save Platform Settings</Button>
        </form>
      </Card>
    </PageShell>
  )
}
