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

  const Logo = ({
    width,
    className,
  }: {
    width: number
    className?: string
  }) => (
    <Link to="/admin" className={className}>
      <Image src={LOGO} width={width} />
    </Link>
  )

  const drawerContent = (
    <>
      <div className="h-screen overflow-auto">
        <div className="sticky top-0 bg-white pb-10 px-8">
          <Logo width={150} />
        </div>

        <div className="flex flex-col">{renderNavLinks()}</div>
      </div>
      <Logout />
    </>
  )

  return (
    <main className="lg:flex h-screen lg:overflow-hidden overflow-auto">
      <aside className="w-[300px] rounded-tr-[40px] shadow-xl py-10 hidden lg:flex lg:justify-between lg:flex-col sticky top-0 bg-white overflow-hidden z-20">
        {drawerContent}
      </aside>
      <div className="lg:hidden flex justify-between py-4 px-5 shadow-md sticky top-0 bg-white z-20">
        <Logo width={120} />
        <div>
          <Drawer opened={opened} onClose={close}>
            {drawerContent}
          </Drawer>
          <Group position="center">
            <Burger
              opened={opened}
              onClick={open}
              className="[&>*]:bg-[#262626] [&>*]:before:bg-[#262626] [&>*]:after:bg-[#262626]"
            />
          </Group>
        </div>
      </div>

      <div className="flex-1 bg-[#F4F7FE] min-h-screen overflow-auto">
        <Outlet />
      </div>
    </main>
  )
}

export default Dashboard
