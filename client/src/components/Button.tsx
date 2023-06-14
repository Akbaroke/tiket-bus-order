import * as React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  className?: string
  text?: string
  children?: React.ReactNode
  disabled?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  className,
  text,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        'flex items-center justify-center gap-x-2 text-white py-2 rounded-[10px] [&>svg]:w-5 [&>svg]:h-5 bg-[#0266FF] active:scale-95 transition-all',
        className,
        disabled && 'bg-gray-400 cursor-wait'
      )}>
      {text || children}
    </button>
  )
}
