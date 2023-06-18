import { Link, Outlet } from 'react-router-dom'
import { GiMeepleGroup } from 'react-icons/gi'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import NavDropdown from '../../components/NavDropdown'

function Dashboard() {
  return (
    <main className="flex">
      <aside className="w-[300px] rounded-tr-[40px] shadow-xl h-screen py-10">
        <Link to="/admin" className="block mb-10 px-8">
          <h1 className="font-bold text-[35px] text-blue-500 align-middle">
            GO🚍BUS
          </h1>
        </Link>
        <div className="flex flex-col">
          <NavDropdown
            text="class"
            icon={<GiMeepleGroup />}>
            <Link to="/admin/viewclass">View Class</Link>
            <Link to="/admin/addclass">Add Class</Link>
            <Link to="/admin/editclass">Edit Class</Link>
          </NavDropdown>
          <NavDropdown
            text="Armada"
            icon={<HiOutlineBuildingOffice2 />}>
            <Link to="/admin/viewarmada">View Armada</Link>
            <Link to="/admin/addarmada">Add Armada</Link>
            <Link to="/admin/editarmada">Edit Armada</Link>
          </NavDropdown>
        </div>
      </aside>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  )
}

export default Dashboard
