import { Link, Outlet } from 'react-router-dom'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { BsFillBusFrontFill } from 'react-icons/bs'
import { SlLocationPin } from 'react-icons/sl'
import { TbBusStop } from 'react-icons/tb'
import { AiOutlineSchedule } from 'react-icons/ai'
import Nav from '../../components/Nav'
import { MdHotelClass } from 'react-icons/md'
import { Burger, Drawer, Group, Image } from '@mantine/core'
import LOGO from '../../assets/Logo.svg'
import { useDisclosure } from '@mantine/hooks'
import Logout from '../../components/Logout'

function Dashboard() {
  const [opened, { open, close }] = useDisclosure(false)

  const navLinks = [
    {
      text: 'class',
      icon: <MdHotelClass />,
      to: '/admin/class',
    },
    {
      text: 'Armada',
      icon: <HiOutlineBuildingOffice2 />,
      to: '/admin/armada',
    },
    {
      text: 'Bus',
      icon: <BsFillBusFrontFill />,
      to: '/admin/bus',
    },
    { text: 'City', icon: <SlLocationPin />, to: '/admin/city' },
    {
      text: 'Bus Station',
      icon: <TbBusStop />,
      to: '/admin/station',
    },
    {
      text: 'Schedule',
      icon: <AiOutlineSchedule />,
      to: '/admin/schedule',
    },
  ]

  const renderNavLinks = () => {
    return navLinks.map(link => (
      <Nav
        key={link.to}
        text={link.text}
        icon={link.icon}
        to={link.to}
        onClose={close}
      />
    ))
  }

  const drawerContent = (
    <>
      <Link to="/admin" className="block mb-10 px-8">
        <Image src={LOGO} width={180} />
      </Link>
      <div className="flex flex-col">{renderNavLinks()}</div>
      <Logout />
    </>
  )

  return (
    <main className="flex">
      <aside className="w-[300px] rounded-tr-[40px] shadow-xl h-screen py-10 hidden sm:block">
        {drawerContent}
      </aside>
      <div className="sm:hidden">
        <Drawer opened={opened} onClose={close}>
          {drawerContent}
        </Drawer>
        <Group position="center">
          <Burger opened={opened} onClick={open} />
        </Group>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  )
}

export default Dashboard
