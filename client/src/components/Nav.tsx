import clsx from 'clsx'
import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'

type Props = {
  text: string
  to: string
  icon: JSX.Element
}

export default function Nav({ text, to, icon }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const elementRef = React.useRef<HTMLAnchorElement>(null)
  const location = useLocation()
  const route = location.pathname

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (
      elementRef.current &&
      !elementRef.current.contains(target)
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
    <Link
      to={to}
      ref={elementRef}
      className={clsx(
        'flex gap-[18px] items-center px-9 py-6 w-full border border-x-0 hover:border-y-[#F0EFF2] transition-all cursor-pointer [&>svg]:text-[20px]',
        isOpen ? 'border-y-[#F0EFF2]' : '',
        route === to
          ? 'border-y-[#F0EFF2]'
          : 'border-y-white'
      )}
      onClick={() => {
        setIsOpen(!isOpen)
      }}>
      {icon}
      <div className="flex w-full justify-between items-center">
        <p className="text-[14px] font-medium capitalize">
          {text}
        </p>
      </div>
    </Link>
  )
}
