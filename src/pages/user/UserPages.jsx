import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { CalendarDays, CircleDollarSign, LayoutDashboard, Search, ShieldCheck, Wallet } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button, Card, Input, PageShell, Select, StatusTag } from '../../components/common'
import { useLiveParkingSync } from '../../hooks/useLiveParkingSync'
import { useAppStore } from '../../store/useAppStore'

function QrTicket({ token }) {
  const cells = Array.from({ length: 81 }, (_, index) => {
    const code = token.charCodeAt(index % token.length) + index
    return code % 3 === 0
  })

  return (
    <div className="grid w-fit grid-cols-9 gap-1 rounded-card bg-white p-3">
      {cells.map((filled, index) => (
        <span key={index} className={`h-2.5 w-2.5 rounded-sm ${filled ? 'bg-slate-950' : 'bg-slate-200'}`} />
      ))}
    </div>
  )
}

function LiveSignal() {
  const websocketConnected = useAppStore((state) => state.websocketConnected)

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
      <span className={`h-2 w-2 rounded-full ${websocketConnected ? 'bg-emerald-300' : 'bg-rose-300'}`} />
      {websocketConnected ? 'WebSocket live' : 'Feed offline'}
    </div>
  )
}

export function UserLandingPage() {
  useLiveParkingSync()
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const parkingLots = useAppStore((state) => state.parkingLots)

  const totalAvailable = parkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0)

  return (
    <PageShell title="Smart Parking. Live Access." subtitle="Reserve a verified slot, pay instantly, and unlock entry with QR-based gate control.">
      <Card className="bg-deepNavy/60 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <LiveSignal />
          <p className="text-sm text-slate-300">{totalAvailable} slots currently available across connected hubs.</p>
        </div>
        <form onSubmit={handleSubmit(() => navigate('/user/browse'))} className="grid gap-3 md:grid-cols-4">
          <Input label="Destination" placeholder="Airport, metro, business park" {...register('location')} />
          <Input label="Start Time" type="datetime-local" {...register('startTime')} />
          <Input label="Hours Needed" type="number" min="1" max="24" {...register('duration')} />
          <Select label="Vehicle Type" {...register('vehicleType')}>
            <option>Sedan</option>
            <option>SUV</option>
            <option>EV</option>
            <option>Bike</option>
          </Select>
          <Button className="md:col-span-4" variant="amber" type="submit">
            Find Live Parking
          </Button>
        </form>
      </Card>

      <section className="grid gap-4 lg:grid-cols-4">
          {[
          { label: 'Live Slots', value: `${totalAvailable}`, icon: LayoutDashboard },
          { label: 'Avg Entry Time', value: '24 sec', icon: CalendarDays },
          { label: 'Payment Rails', value: 'UPI / Stripe / Razorpay', icon: CircleDollarSign },
          { label: 'ANPR + QR', value: 'Gate-ready', icon: ShieldCheck },
        ].map((item) => (
          <Card key={item.label}>
            <item.icon className="mb-3 text-cyan-300" size={20} />
            <p className="text-sm text-slate-300">{item.label}</p>
            <p className="font-heading text-xl">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <Search className="mb-3 text-amber-300" size={20} />
          <h3 className="font-heading text-lg">Live parking availability</h3>
          <p className="mt-2 text-sm text-slate-300">Every hub updates slot counts in near real time so drivers avoid full-lot dead ends.</p>
        </Card>
        <Card>
          <ShieldCheck className="mb-3 text-emerald-300" size={20} />
          <h3 className="font-heading text-lg">QR entry control</h3>
          <p className="mt-2 text-sm text-slate-300">Bookings generate secure access passes for barrier entry and operator verification.</p>
        </Card>
        <Card>
          <Wallet className="mb-3 text-blue-300" size={20} />
          <h3 className="font-heading text-lg">Vehicle tracking flow</h3>
          <p className="mt-2 text-sm text-slate-300">See whether the vehicle is approaching, queued, gate-ready, or already parked.</p>
        </Card>
      </section>
    </PageShell>
  )
}

export function UserBrowsePage() {
  useLiveParkingSync()
  const navigate = useNavigate()
  const parkingLots = useAppStore((state) => state.parkingLots)
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft)

  return (
    <PageShell title="Browse Parking Hubs" subtitle="Compare occupancy, pricing, EV support, and gate readiness before reserving.">
      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <Card className="h-fit space-y-3">
          <h3 className="font-heading text-lg">Filters</h3>
          <Input label="Area" placeholder="Cyber Hub, Airport, Metro" />
          <Select label="Availability">
            <option>Any</option>
            <option>Open</option>
            <option>Limited</option>
            <option>Full</option>
          </Select>
          <Select label="Amenities">
            <option>Any</option>
            <option>EV Charging</option>
            <option>Covered Parking</option>
            <option>Camera Monitored</option>
          </Select>
          <Select label="Pricing">
            <option>Any</option>
            <option>Under Rs 100/hr</option>
            <option>Rs 100-150/hr</option>
            <option>Rs 150+/hr</option>
          </Select>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {parkingLots.map((lot) => (
            <Card key={lot.id} className="overflow-hidden p-0">
              <div className="h-32 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.45),_transparent_40%),linear-gradient(135deg,rgba(37,99,235,0.35),rgba(15,23,42,0.95))]" />
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg">{lot.name}</h3>
                    <p className="text-sm text-slate-300">{lot.location}</p>
                  </div>
                  <StatusTag value={lot.status} />
                </div>
                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <p>{lot.availableSlots} / {lot.totalSlots} slots open</p>
                  <p>Rs {lot.pricePerHour} per hour</p>
                  <p>Gate: {lot.entryGate}</p>
                  <p>EV chargers: {lot.evFastChargers}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate(`/user/car/${lot.id}`)}>View Hub</Button>
                  <Button
                    className="w-full"
                    variant="amber"
                    onClick={() => {
                      updateBookingDraft({ lotId: lot.id })
                      toast.success('Live slot queued for booking')
                      navigate('/user/booking-flow')
                    }}
                  >
                    Reserve Slot
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

export function UserCarDetailPage() {
  useLiveParkingSync()
  const { id } = useParams()
  const navigate = useNavigate()
  const parkingLots = useAppStore((state) => state.parkingLots)
  const liveSessions = useAppStore((state) => state.liveSessions)
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft)
  const selected = useMemo(() => parkingLots.find((lot) => lot.id === id), [parkingLots, id])
  const hubSessions = useMemo(() => liveSessions.filter((session) => session.lotId === id).slice(0, 3), [liveSessions, id])

  if (!selected) {
    return (
      <PageShell title="Parking Hub" subtitle="This hub could not be found in the live network.">
        <Card>
          <Button onClick={() => navigate('/user/browse')}>Back to Browse</Button>
        </Card>
      </PageShell>
    )
  }

  return (
    <PageShell title="Parking Hub Detail" subtitle="See the live supply, gate setup, and current movement around this facility.">
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-36 rounded-control bg-[linear-gradient(135deg,rgba(34,211,238,0.32),rgba(15,23,42,0.96))]" />
            <div className="h-36 rounded-control bg-[linear-gradient(135deg,rgba(59,130,246,0.28),rgba(15,23,42,0.96))]" />
            <div className="h-36 rounded-control bg-[linear-gradient(135deg,rgba(245,158,11,0.24),rgba(15,23,42,0.96))]" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-xl">{selected.name}</h3>
              <p className="text-sm text-slate-300">{selected.location} | Zone {selected.zone}</p>
            </div>
            <StatusTag value={selected.status} />
          </div>
          <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
            <p>{selected.availableSlots} live slots currently free</p>
            <p>Rs {selected.pricePerHour} / hour dynamic tariff</p>
            <p>{selected.evFastChargers} fast EV chargers active</p>
            <p>{selected.cameras} surveillance cameras online</p>
            <p>Entry via {selected.entryGate}</p>
            <p>Exit via {selected.exitGate}</p>
          </div>
          <Card className="bg-deepNavy">
            <h4 className="font-heading text-base">Vehicle movement feed</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              {hubSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-control border border-slate-700 px-3 py-2">
                  <span>{session.vehicleNumber} at {session.checkpoint}</span>
                  <span>{session.etaMinutes === 0 ? session.stage : `${session.etaMinutes} min`}</span>
                </div>
              ))}
            </div>
          </Card>
        </Card>

        <Card>
          <h3 className="font-heading text-lg">Reserve this hub</h3>
          <p className="mt-2 text-sm text-slate-300">Lock a bay now and receive a QR pass for barrier access.</p>
          <div className="mt-4 space-y-3">
            <Button
              className="w-full"
              variant="amber"
              onClick={() => {
                updateBookingDraft({ lotId: selected.id })
                navigate('/user/booking-flow')
              }}
            >
              Continue to Slot Booking
            </Button>
            <Card className="bg-deepNavy">
              <p className="text-sm text-slate-300">Demand signal</p>
              <p className="font-heading text-lg">{selected.demand}</p>
            </Card>
          </div>
        </Card>
      </div>
    </PageShell>
  )
}

export function UserBookingFlowPage() {
  useLiveParkingSync()
  const parkingLots = useAppStore((state) => state.parkingLots)
  const bookingDraft = useAppStore((state) => state.bookingDraft)
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft)
  const resetBookingDraft = useAppStore((state) => state.resetBookingDraft)
  const createParkingBooking = useAppStore((state) => state.createParkingBooking)
  const [step, setStep] = useState(1)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const { control, register, handleSubmit } = useForm({
    defaultValues: bookingDraft,
  })
  const watchedLotId = useWatch({ control, name: 'lotId', defaultValue: bookingDraft.lotId })
  const watchedDuration = useWatch({ control, name: 'durationHours', defaultValue: bookingDraft.durationHours })
  const watchedVehicleNumber = useWatch({ control, name: 'vehicleNumber', defaultValue: bookingDraft.vehicleNumber })
  const watchedPaymentMethod = useWatch({ control, name: 'paymentMethod', defaultValue: bookingDraft.paymentMethod })

  const selectedLot = useMemo(() => {
    return parkingLots.find((lot) => lot.id === watchedLotId) ?? parkingLots[0]
  }, [parkingLots, watchedLotId])

  const completeStep = (values) => {
    updateBookingDraft(values)

    if (step < 4) {
      setStep((current) => current + 1)
      toast.success(`Step ${step} synced`)
      return
    }

    if (!selectedLot || selectedLot.availableSlots <= 0) {
      toast.error('This hub is temporarily full. Try another live location.')
      return
    }

    createParkingBooking({ ...bookingDraft, ...values })
    const latest = useAppStore.getState().parkingBookings[0]
    setConfirmedBooking(latest)
    toast.success('Payment captured and QR pass issued')
  }

  const totalAmount = selectedLot ? selectedLot.pricePerHour * Number(watchedDuration || bookingDraft.durationHours || 1) : 0

  return (
    <PageShell title="Slot Booking Flow" subtitle="Hub selection -> Vehicle details -> Payment integration -> QR access pass">
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {['Hub', 'Vehicle', 'Payment', 'Access'].map((label, index) => (
            <span
              key={label}
              className={`rounded-full px-3 py-1 ${step >= index + 1 ? 'bg-electricBlue/25 text-blue-200' : 'bg-slate-800 text-slate-400'}`}
            >
              {index + 1}. {label}
            </span>
          ))}
        </div>

        {!confirmedBooking ? (
          <form onSubmit={handleSubmit(completeStep)} className="grid gap-3 md:grid-cols-2">
            {step === 1 ? (
              <>
                <Select label="Parking Hub" {...register('lotId')}>
                  {parkingLots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.name} - {lot.availableSlots} open
                    </option>
                  ))}
                </Select>
                <Input label="Start Time" type="datetime-local" {...register('startTime', { required: true })} />
                <Input label="Duration (hours)" type="number" min="1" max="24" {...register('durationHours', { required: true })} />
                <Input label="Estimated Amount" value={`Rs ${totalAmount}`} readOnly />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Input label="Vehicle Number" placeholder="DL 8C AX 4421" {...register('vehicleNumber', { required: true })} />
                <Select label="Vehicle Type" {...register('vehicleType')}>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>EV</option>
                  <option>Bike</option>
                </Select>
                <Select label="Charging Add-on" {...register('charging')}>
                  <option>None</option>
                  <option>Fast charger</option>
                  <option>Battery top-up bay</option>
                </Select>
                <Select label="Entry Preference" {...register('entryPreference')}>
                  <option>QR lane</option>
                  <option>ANPR auto-open</option>
                  <option>Operator assist</option>
                </Select>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <Select label="Payment Gateway" {...register('paymentMethod')}>
                  <option>UPI</option>
                  <option>Stripe</option>
                  <option>Razorpay</option>
                </Select>
                <Input label="Payment Reference" placeholder="upi@bank or card token" {...register('paymentReference')} />
                <Input label="Billing Amount" value={`Rs ${totalAmount}`} readOnly />
                <Input label="Security Check" value="PCI-safe tokenized checkout enabled" readOnly />
              </>
            ) : null}

            {step === 4 ? (
              <Card className="md:col-span-2 bg-deepNavy">
                <h3 className="font-heading text-lg">Confirm booking package</h3>
                <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                  <p>Hub: {selectedLot?.name}</p>
                  <p>Vehicle: {watchedVehicleNumber || bookingDraft.vehicleNumber || 'Pending'}</p>
                  <p>Duration: {watchedDuration || bookingDraft.durationHours} hours</p>
                  <p>Payment rail: {watchedPaymentMethod || bookingDraft.paymentMethod || 'Pending'}</p>
                  <p>Entry gate: {selectedLot?.entryGate}</p>
                  <p>Total: Rs {totalAmount}</p>
                </div>
              </Card>
            ) : null}

            <Button className="md:col-span-2" variant="amber" type="submit">
              {step === 4 ? 'Capture Payment and Generate QR' : 'Continue'}
            </Button>
          </form>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <Card className="bg-emerald-900/20">
              <h3 className="font-heading text-xl">Access Pass Ready</h3>
              <p className="mt-2 text-sm text-slate-300">Booking {confirmedBooking.id} is confirmed and synced with the gate system.</p>
              <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                <p>Hub: {confirmedBooking.lotName}</p>
                <p>Slot: {confirmedBooking.slotLabel}</p>
                <p>Vehicle: {confirmedBooking.vehicleNumber}</p>
                <p>Payment: {confirmedBooking.paymentStatus}</p>
                <p>Status: {confirmedBooking.status}</p>
                <p>Total: Rs {confirmedBooking.amount}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => {
                    resetBookingDraft()
                    setConfirmedBooking(null)
                    setStep(1)
                  }}
                >
                  Book Another Slot
                </Button>
                <Button variant="ghost" onClick={() => toast.success('QR pass mirrored to operator dashboard')}>
                  Share with Gate Operator
                </Button>
              </div>
            </Card>

            <Card className="flex flex-col items-center justify-center gap-4">
              <QrTicket token={confirmedBooking.qrToken} />
              <div className="text-center">
                <p className="font-heading text-lg">{confirmedBooking.qrToken}</p>
                <p className="text-sm text-slate-300">Scan at entry to auto-open the barrier.</p>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </PageShell>
  )
}

export function UserDashboardPage() {
  useLiveParkingSync()
  const parkingBookings = useAppStore((state) => state.parkingBookings)
  const liveSessions = useAppStore((state) => state.liveSessions)
  const paymentFeed = useAppStore((state) => state.paymentFeed)

  const totalSpent = parkingBookings.reduce((sum, row) => sum + row.amount, 0)
  const activeSessions = liveSessions.filter((session) => session.stage !== 'Exited')

  return (
    <PageShell title="Driver Dashboard" subtitle="Track live sessions, QR-ready reservations, and your parking spend in one view.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Live Sessions</p><p className="font-heading text-2xl">{activeSessions.length}</p></Card>
        <Card><p className="text-sm text-slate-300">Reservations</p><p className="font-heading text-2xl">{parkingBookings.length}</p></Card>
        <Card><p className="text-sm text-slate-300">Total Spend</p><p className="font-heading text-2xl">Rs {totalSpent}</p></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <h3 className="font-heading text-lg">Vehicle Tracking</h3>
          <div className="mt-3 space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="rounded-control border border-slate-700 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p>{session.vehicleNumber}</p>
                  <StatusTag value={session.stage} />
                </div>
                <p className="mt-1 text-slate-300">{session.lotName}</p>
                <p className="mt-2 text-slate-400">{session.checkpoint}</p>
                <p className="mt-1 text-cyan-200">{session.etaMinutes === 0 ? 'Ready at gate' : `${session.etaMinutes} min to entry`}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-lg">Latest Payments</h3>
          <div className="mt-3 space-y-3 text-sm">
            {paymentFeed.slice(0, 4).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-control border border-slate-700 px-3 py-2">
                <span>{payment.gateway}</span>
                <span>Rs {payment.amount}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </PageShell>
  )
}

export function UserProfilePage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: 'Ava Carter',
      email: 'ava@driveease.app',
      vehicleNumber: 'DL 8C AX 4421',
      notifications: true,
    },
  })

  return (
    <PageShell title="Profile & Vehicles" subtitle="Manage your account, registered vehicles, and parking alerts.">
      <Card>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(() => toast.success('Driver profile updated'))}>
          <Input label="Full Name" {...register('fullName')} />
          <Input label="Email" type="email" {...register('email')} />
          <Input label="Primary Vehicle" {...register('vehicleNumber')} />
          <Input label="Access Tag ID" value="ANPR-LINKED-7742" readOnly />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" {...register('notifications')} /> Send live gate, slot, and overstay alerts
          </label>
          <Button className="md:col-span-2" variant="amber" type="submit">Save Changes</Button>
        </form>
      </Card>
    </PageShell>
  )
}

export function UserBookingsPage() {
  useLiveParkingSync()
  const parkingBookings = useAppStore((state) => state.parkingBookings)

  return (
    <PageShell title="My Parking Bookings" subtitle="Review reservation state, payment status, and QR access readiness.">
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Booking ID</th>
                <th>Hub</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parkingBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-700">
                  <td className="py-3">{booking.id}</td>
                  <td>{booking.lotName}</td>
                  <td>{booking.vehicleNumber}</td>
                  <td>Rs {booking.amount}</td>
                  <td><StatusTag value={booking.status} /></td>
                  <td className="space-x-2">
                    <Button className="px-2 py-1 text-xs" variant="ghost" onClick={() => toast.success(`QR token ${booking.qrToken}`)}>
                      Show QR
                    </Button>
                    <Button className="px-2 py-1 text-xs" variant="ghost" onClick={() => toast('Support escalation created')}>
                      Get Help
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
