import { Route, Routes } from 'react-router'
import Home from '../pages/User'
import Dashboard from '../pages/Admin'
import Admin from '../middlewares/Admin'
import User from '../middlewares/User'
import Guest from '../middlewares/Guest'
import ViewClass from '../pages/Admin/Class/ViewClass'
import ViewArmada from '../pages/Admin/Armada/ViewArmada'
import ViewBus from '../pages/Admin/Bus/ViewBus'
import { SWRProvider } from '../contexts/swr-context'
import ViewCity from '../pages/Admin/City/ViewCity'
import ViewStation from '../pages/Admin/Station/ViewStation'
import ViewSchedule from '../pages/Admin/Schedule/ViewSchedule'
import NewOrder from '../pages/User/NewOrder/Layout'
import ListOrder from '../pages/User/HistoryOrder/ListOrder'
import DetailOrder from '../pages/User/HistoryOrder/DetailOrder'
import ViewPayment from '../pages/Admin/Payment/ViewPayment'
import ViewDashboard from '../pages/Admin/Dashboard/ViewDashboard'
import Auth from '../pages/Auth/Auth'
import { PageNotFound } from '../pages/PageNotFound'

export default function root() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <Guest>
            <Auth />
          </Guest>
        }
      />

      <Route
        path="/"
        element={
          <User>
            <SWRProvider>
              <Home />
            </SWRProvider>
          </User>
        }>
        <Route index element={<NewOrder />} />
        <Route path="/history" element={<ListOrder />} />
        <Route path="/history/:id" element={<DetailOrder />} />
      </Route>

      <Route
        path="/admin"
        element={
          <Admin>
            <SWRProvider>
              <Dashboard />
            </SWRProvider>
          </Admin>
        }>
        <Route index element={<ViewDashboard />} />
        <Route path="/admin/class" element={<ViewClass />} />
        <Route path="/admin/armada" element={<ViewArmada />} />
        <Route path="/admin/bus" element={<ViewBus />} />
        <Route path="/admin/city" element={<ViewCity />} />
        <Route path="/admin/station" element={<ViewStation />} />
        <Route
          path="/admin/schedule"
          element={<ViewSchedule />}
        />
        <Route path="/admin/payment" element={<ViewPayment />} />
      </Route>
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  )
}
