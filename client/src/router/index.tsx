import { Route, Routes } from 'react-router';
import Auth from '../pages/Auth/Auth'
import Home from '../pages/User/Home'
import Dashboard from '../pages/Admin'
import Admin from '../middlewares/Admin'
import User from '../middlewares/User'
import Guest from '../middlewares/Guest'
import ViewScedule from '../pages/Admin/Scedule/ViewScedule'
import AddClass from '../pages/Admin/Class/AddClass'
import EditClass from '../pages/Admin/Class/EditClass'

export default function root() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Guest>
            <Auth />
          </Guest>
        }
      />

      <Route
        path="/home"
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
            <Dashboard />
          </Admin>
        }>
        <Route index element={<ViewScedule />} />
        <Route
          path="/admin/addclass"
          element={<AddClass />}
        />
        <Route
          path="/admin/editclass"
          element={<EditClass />}
        />
      </Route>
    </Routes>
  )
}
