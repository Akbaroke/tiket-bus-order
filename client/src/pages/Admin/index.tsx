import { Link, Outlet } from 'react-router-dom'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { BsFillBusFrontFill } from 'react-icons/bs'
import Nav from '../../components/Nav'
import { MdHotelClass } from 'react-icons/md'
import { Image } from '@mantine/core'
import LOGO from '../../assets/Logo.svg'

function Dashboard() {
  return (
    <main className="flex">
      <aside className="w-[300px] rounded-tr-[40px] shadow-xl h-screen py-10">
        <Link to="/admin" className="block mb-10 px-8">
          <Image src={LOGO} width={180} />
        </Link>
        <div className="flex flex-col">
          <Nav
            text="class"
            icon={<MdHotelClass />}
            to="/admin/class"
          />
          <Nav
            text="Armada"
            icon={<HiOutlineBuildingOffice2 />}
            to="/admin/armada"
          />
          <Nav
            text="Bus"
            icon={<BsFillBusFrontFill />}
            to="/admin/bus"
          />
        </div>
      </aside>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  )
}

export default Dashboard
