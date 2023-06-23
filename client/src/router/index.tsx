import { Route, Routes } from 'react-router'
import Home from '../pages/User/Home'
import Dashboard from '../pages/Admin'
import Admin from '../middlewares/Admin'
import User from '../middlewares/User'
import Guest from '../middlewares/Guest'
import ViewClass from '../pages/Admin/Class/ViewClass'
import ViewArmada from '../pages/Admin/Armada/ViewArmada'
import ViewBus from '../pages/Admin/Bus/ViewBus'
import Signin from '../pages/Auth/Signin'
import Signup from '../pages/Auth/Signup'
import { SWRProvider } from '../contexts/swr-context'
import ViewCity from '../pages/Admin/City/ViewCity'
import ViewStation from '../pages/Admin/Station/ViewStation'
import ViewSchedule from '../pages/Admin/Schedule/ViewSchedule'

export default function root() {
  return (
    <Routes>
      <Route
        path="/signin"
        element={
          <Guest>
            <Signin />
          </Guest>
        }
      />
      <Route
        path="/signup"
        element={
          <Guest>
            <Signup />
          </Guest>
        }
      />

      <Route
        path="/"
        element={
          <User>
            <Home />
          </User>
        }
      />

      <Route
        path="/admin"
        element={
          <Admin>
            <SWRProvider>
              <Dashboard />
            </SWRProvider>
          </Admin>
        }>
        <Route
          index
          element={
            <div className="grid place-items-center h-screen">
              Dashboard Admin
            </div>
          }
        />
        <Route
          path="/admin/class"
          element={<ViewClass />}
        />
        <Route
          path="/admin/armada"
          element={<ViewArmada />}
        />
        <Route path="/admin/bus" element={<ViewBus />} />
        <Route path="/admin/city" element={<ViewCity />} />
        <Route
          path="/admin/station"
          element={<ViewStation />}
        />
        <Route
          path="/admin/schedule"
          element={<ViewSchedule />}
        />
      </Route>
    </Routes>
  )
}
