import * as React from 'react'
import { motion } from 'framer-motion'

type Props = {
  text: string
  icon: JSX.Element
  children: React.ReactNode
}

export default function NavDropdown({
  text,
  icon,
  children,
}: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const arrowAnimation = isOpen ? 'rotate-180' : ''

  return (
    <div>
      <div
        className="flex gap-[18px] items-center px-9 py-6 w-full border border-white hover:border-[#F0EFF2] transition-all cursor-pointer [&>svg]:text-[20px]"
        onClick={() => setIsOpen(!isOpen)}>
        {icon}
        <p className="text-[14px] font-medium capitalize">
          {text}
        </p>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}>
        <div className="flex flex-col text-right">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
