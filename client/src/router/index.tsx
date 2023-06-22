import { Route, Routes } from 'react-router'
import Home from '../pages/User/Home'
import Dashboard from '../pages/Admin'
import Admin from '../middlewares/Admin'
import User from '../middlewares/User'
import Guest from '../middlewares/Guest'
import AddClass from '../pages/Admin/Class/AddClass'
import ViewClass from '../pages/Admin/Class/ViewClass'
import ViewArmada from '../pages/Admin/Armada/ViewArmada'
import AddArmada from '../pages/Admin/Armada/AddArmada'
import EditArmada from '../pages/Admin/Armada/EditArmada'
import ViewBus from '../pages/Admin/Bus/ViewBus'
import AddBus from '../pages/Admin/Bus/AddBus'
import Signin from '../pages/Auth/Signin'
import Signup from '../pages/Auth/Signup'
import { SWRProvider } from '../contexts/swr-context'

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
          path="/admin/class/add"
          element={<AddClass />}
        />
        <Route
          path="/admin/armada"
          element={<ViewArmada />}
        />
        <Route
          path="/admin/armada/add"
          element={<AddArmada />}
        />
        <Route
          path="/admin/armada/:id"
          element={<EditArmada />}
        />
        <Route path="/admin/bus" element={<ViewBus />} />
        <Route path="/admin/bus/add" element={<AddBus />} />
      </Route>
    </Routes>
  )
}
