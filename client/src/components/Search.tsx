import clsx from 'clsx'
import * as React from 'react'
import { LuSearch } from 'react-icons/lu'
import { RxCross2 } from 'react-icons/rx'

type Props = {
  value: string
  className?: string
  setClearValue: () => void
} & React.InputHTMLAttributes<HTMLInputElement>

const Search = React.forwardRef<HTMLInputElement, Props>(
  ({ value, setClearValue, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex justify-between rounded-[10px] shadow-lg overflow-hidden items-center px-[10px]',
          className
        )}>
        <input
          {...props}
          value={value}
          type="text"
          placeholder="Search"
          className="placeholder:text-black w-full h-full px-2 text-[14px]"
        />
        <div>
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
)

export default Search
