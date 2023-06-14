import * as React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  className?: string
  text?: string
  children?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  className,
  text,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'flex items-center justify-center gap-x-2 text-white py-2 rounded-[10px] [&>svg]:w-5 [&>svg]:h-5 bg-[#0266FF] active:scale-95 transition-all',
        className
      )}>
      {text || children}
    </button>
  )
}
