import * as React from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

type Props = {
  label: string
  icon: React.ReactElement
  placeholder?: string
  type?: 'text' | 'email' | 'number' | 'password'
} & React.InputHTMLAttributes<HTMLInputElement>

function InputAuth({
  label,
  icon,
  type = 'text',
  ...props
}: Props) {
  const [isPasswordHide, setIsPasswordHide] =
    React.useState(false)
  const labelName = label.toLowerCase().split(' ')[0]

  return (
    <div className="flex items-center border-[3px] rounded-[10px] gap-5 px-[30px] relative">
      <div className="py-[24px] [&>svg]:text-[24px]">
        {icon}
      </div>
      <span className="w-[3px] h-[30px] bg-[#f0eff2] rounded-xl"></span>
      <div className="flex flex-col gap-[2px] w-56">
        <label
          htmlFor={labelName}
          className="capitalize text-[#989b9b] text-[14px] font-medium">
          {label}
        </label>
        <input
          {...props}
          type={
            type === 'password'
              ? isPasswordHide
                ? 'text'
                : type
              : type
          }
          id={labelName}
          className="text-black font-medium text-[14px]"
        />
      </div>
      {type === 'password' ? (
        <div
          className="absolute right-6 cursor-pointer [&>svg]:text-[20px] [&>svg]:text-[#989b9b]"
          onClick={() =>
            setIsPasswordHide(
              isPasswordHide => !isPasswordHide
            )
          }>
          {isPasswordHide ? <FiEye /> : <FiEyeOff />}
        </div>
      ) : null}
    </div>
  )
}

export default InputAuth
