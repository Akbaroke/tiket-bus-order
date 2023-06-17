import { Link, Outlet } from 'react-router-dom'
import { GiMeepleGroup } from 'react-icons/gi'
import NavDropdown from '../../components/NavDropdown'

function Dashboard() {
  return (
    <main className="flex">
      <aside className="w-[300px] rounded-tr-[40px] shadow-xl h-screen py-10">
        <div className="mb-10 px-5">
          <h1 className="font-bold text-[35px] text-blue-500 align-middle">
            GO🚍BUS
          </h1>
        </div>
        <div className="flex flex-col">
          <NavDropdown
            text="class"
            icon={<GiMeepleGroup />}>
            <Link to="/admin/addclass">Add Class</Link>
            <Link to="/admin/editclass">Edit Class</Link>
          </NavDropdown>
        </div>
      </aside>

      <div>
        <Outlet />
      </div>
    </main>
  )
}

export default Dashboard
