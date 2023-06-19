import * as React from 'react'
import { motion } from 'framer-motion'
import { IoIosArrowUp } from 'react-icons/io'
import clsx from 'clsx'

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
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(target)
    ) {
      setIsOpen(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener(
        'click',
        handleClickOutside
      )
    }
  }, [])

  return (
    <div ref={dropdownRef}>
      <div
        className={clsx(
          'flex gap-[18px] items-center px-9 py-6 w-full border border-x-0 hover:border-y-[#F0EFF2] transition-all cursor-pointer [&>svg]:text-[20px]',
          isOpen ? 'border-y-[#F0EFF2]' : 'border-white'
        )}
        onClick={toggleDropdown}>
        {icon}
        <div className="flex w-full justify-between items-center">
          <p className="text-[14px] font-medium capitalize">
            {text}
          </p>
          <IoIosArrowUp
            className={clsx(
              arrowAnimation,
              'transition-all'
            )}
          />
        </div>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}>
        <div
          className="flex flex-col mt-1"
          onClick={toggleDropdown}>
          {React.Children.map(children, child => (
            <div className="mx-4 rounded-[10px] hover:bg-[#F0EFF2] cursor-pointer [&>*]:w-full [&>*]:block [&>*]:px-5 [&>*]:py-3">
              {child}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
