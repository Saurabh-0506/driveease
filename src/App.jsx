import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PortalLayout from './components/PortalLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { PageLoader } from './components/common'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

const lazyNamed = (factory, exportName) =>
  lazy(() => factory().then((module) => ({ default: module[exportName] })))

const AdminBookingsPage = lazyNamed(() => import('./pages/admin/AdminPages'), 'AdminBookingsPage')
const AdminDashboardPage = lazyNamed(() => import('./pages/admin/AdminPages'), 'AdminDashboardPage')
const AdminFleetPage = lazyNamed(() => import('./pages/admin/AdminPages'), 'AdminFleetPage')
const AdminRevenuePage = lazyNamed(() => import('./pages/admin/AdminPages'), 'AdminRevenuePage')
const AdminSettingsPage = lazyNamed(() => import('./pages/admin/AdminPages'), 'AdminSettingsPage')
const AdminUsersPage = lazyNamed(() => import('./pages/admin/AdminPages'), 'AdminUsersPage')
const AdminVendorsPage = lazyNamed(() => import('./pages/admin/AdminPages'), 'AdminVendorsPage')
const UserBookingFlowPage = lazyNamed(() => import('./pages/user/UserPages'), 'UserBookingFlowPage')
const UserBookingsPage = lazyNamed(() => import('./pages/user/UserPages'), 'UserBookingsPage')
const UserBrowsePage = lazyNamed(() => import('./pages/user/UserPages'), 'UserBrowsePage')
const UserCarDetailPage = lazyNamed(() => import('./pages/user/UserPages'), 'UserCarDetailPage')
const UserDashboardPage = lazyNamed(() => import('./pages/user/UserPages'), 'UserDashboardPage')
const UserLandingPage = lazyNamed(() => import('./pages/user/UserPages'), 'UserLandingPage')
const UserProfilePage = lazyNamed(() => import('./pages/user/UserPages'), 'UserProfilePage')
const VendorBookingsPage = lazyNamed(() => import('./pages/vendor/VendorPages'), 'VendorBookingsPage')
const VendorCarFormPage = lazyNamed(() => import('./pages/vendor/VendorPages'), 'VendorCarFormPage')
const VendorCarsPage = lazyNamed(() => import('./pages/vendor/VendorPages'), 'VendorCarsPage')
const VendorDashboardPage = lazyNamed(() => import('./pages/vendor/VendorPages'), 'VendorDashboardPage')
const VendorEarningsPage = lazyNamed(() => import('./pages/vendor/VendorPages'), 'VendorEarningsPage')
const VendorProfilePage = lazyNamed(() => import('./pages/vendor/VendorPages'), 'VendorProfilePage')

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E2A3A',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <PortalLayout role="user" />
              </ProtectedRoute>
            }
          >
            <Route path="landing" element={<UserLandingPage />} />
            <Route path="browse" element={<UserBrowsePage />} />
            <Route path="car/:id" element={<UserCarDetailPage />} />
            <Route path="booking-flow" element={<UserBookingFlowPage />} />
            <Route path="dashboard" element={<UserDashboardPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="bookings" element={<UserBookingsPage />} />
            <Route index element={<Navigate to="landing" replace />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PortalLayout role="admin" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="vendors" element={<AdminVendorsPage />} />
            <Route path="fleet" element={<AdminFleetPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="revenue" element={<AdminRevenuePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <PortalLayout role="vendor" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<VendorDashboardPage />} />
            <Route path="cars" element={<VendorCarsPage />} />
            <Route path="cars/new" element={<VendorCarFormPage />} />
            <Route path="cars/:id/edit" element={<VendorCarFormPage />} />
            <Route path="bookings" element={<VendorBookingsPage />} />
            <Route path="earnings" element={<VendorEarningsPage />} />
            <Route path="profile" element={<VendorProfilePage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
