import { Image, SegmentedControl, Tooltip } from '@mantine/core'
import * as React from 'react'
import Signin from './Signin'
import Signup from './Signup'
import { Link } from 'react-router-dom'
import LOGO from '../../assets/Logo.svg'
import { BsGithub } from 'react-icons/bs'

export default function Auth() {
  const [value, setValue] = React.useState<string>('signin')
  console.log(import.meta.env.VITE_APP_URL)

  return (
    <div className="bg-[#F4F7FE] w-screen h-screen grid place-items-center">
      <div className="shadow-md top-0 bg-white z-20 fixed right-0 left-0 p-4 px-10 flex justify-between">
        <a href="">
          <Image src={LOGO} width={120} />
        </a>
        <Tooltip
          label="Repository"
          color="dark"
          position="bottom"
          withArrow>
          <Link
            to="https://github.com/Akbaroke/ticket-order"
            target="_blank">
            <BsGithub className="text-[30px]" />
          </Link>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-4">
        <SegmentedControl
          radius="md"
          size="md"
          fullWidth
          value={value}
          onChange={setValue}
          data={[
            { label: 'Signin', value: 'signin' },
            { label: 'Signup', value: 'signup' },
          ]}
        />
        <div className="bg-white p-8 rounded-[10px] shadow-md">
          {value === 'signin' ? (
            <Signin />
          ) : (
            <Signup setValue={setValue} />
          )}
        </div>
      </div>
    </div>
  )
}
