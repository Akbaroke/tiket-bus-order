import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'

type Props = {
  text: string
  to: string
  icon: JSX.Element
  onClose?: () => void
}

export default function Nav({ text, to, icon, onClose }: Props) {
  const location = useLocation()
  const route = location.pathname

  return (
    <Link
      to={to}
      onClick={onClose}
      className={clsx(
        'flex gap-[18px] items-center px-9 py-6 w-full border border-x-0 hover:border-y-[#F0EFF2] transition-all cursor-pointer [&>svg]:text-[20px] ',
        route.includes(to)
          ? 'border-y-[#F0EFF2] [&>svg]:text-[#095BA8]'
          : 'border-y-white [&>svg]:text-[#095BA8]/50'
      )}>
      {icon}
      <div className="flex w-full justify-between items-center">
        <p
          className={clsx(
            'text-[14px] font-medium capitalize',
            route.includes(to)
              ? 'text-[#262626]'
              : 'text-[#9F9F9F]'
          )}>
          {text}
        </p>
      </div>
    </Link>
  )
}
