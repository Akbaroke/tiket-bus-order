import clsx from 'clsx'
import * as React from 'react'
import { LuSearch } from 'react-icons/lu'
import { RxCross2 } from 'react-icons/rx'

type Props = {
  value: string
  className?: string
  setClearValue: () => void
} & React.InputHTMLAttributes<HTMLInputElement>

function Search({
  value,
  setClearValue,
  className,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        'flex justify-between rounded-[10px] shadow-lg overflow-hidden',
        className
      )}>
      <input
        {...props}
        value={value}
        type="text"
        placeholder="Search"
        className="placeholder:text-black w-full h-full px-5 py-3"
      />
      <div className="px-5 py-3">
        {value.length > 0 ? (
          <RxCross2
            onClick={setClearValue}
            className="cursor-pointer"
          />
        ) : (
          <LuSearch />
        )}
      </div>
    </div>
  )
}

export default Search
