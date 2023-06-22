import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Tabs() {
  const navigate = useNavigate()
  const location = useLocation().pathname

  const getStyle = (path: string): string => {
    return clsx(
      location === path
        ? 'bg-white text-black'
        : 'bg-transparent text-[#9F9F9F] cursor-pointer',
      'text-center text-[14px] sm:text-[16px] font-semibold rounded-[10px] w-[150px] h-[40px] sm:w-[200px] sm:h-[50px] grid place-items-center'
    )
  }

  return (
    <div className="bg-[#F0EFF2] rounded-[10px] p-[5px] flex m-auto">
      <div
        className={getStyle('/signin')}
        onClick={() => navigate('/signin')}>
        Sign In
      </div>
      <div
        className={getStyle('/signup')}
        onClick={() => navigate('/signup')}>
        Signup
      </div>
    </div>
  )
}
