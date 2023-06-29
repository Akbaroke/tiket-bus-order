import { Link, Outlet } from 'react-router-dom'
import Nav from '../../components/Nav'
import { Burger, Drawer, Group, Image } from '@mantine/core'
import LOGO from '../../assets/Logo.svg'
import { useDisclosure } from '@mantine/hooks'
import Logout from '../../components/Logout'
import { BsFillBusFrontFill } from 'react-icons/bs'
import { RiHistoryLine } from 'react-icons/ri'

function Home() {
  const [opened, { open, close }] = useDisclosure(false)

  const navLinks = [
    {
      text: 'new order',
      icon: <BsFillBusFrontFill />,
      to: '/',
    },
    {
      text: 'order history',
      icon: <RiHistoryLine />,
      to: '/history',
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
    <Link to="/" className={className}>
      <Image src={LOGO} width={width} />
    </Link>
  )

  const drawerContent = (
    <>
      <div>
        <Logo className="block mb-10 px-8" width={150} />
        <div className="flex flex-col">{renderNavLinks()}</div>
      </div>
      <Logout className="fixed bottom-10 w-[300px]" />
    </>
  )

  return (
    <main className="lg:flex">
      <aside className="w-[300px] rounded-tr-[40px] shadow-xl py-10 hidden lg:flex lg:justify-between lg:flex-col relative min-h-screen bg-white overflow-hidden">
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

      <div className="flex-1 bg-[#F4F7FE] min-h-screen">
        <Outlet />
      </div>
    </main>
  )
}

export default Home
