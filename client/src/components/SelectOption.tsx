import * as React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { IoIosArrowUp } from 'react-icons/io'

type Option = {
  value: string
  label: string
}

type Props = {
  label: string
  icon: React.ReactElement
  options: Option[]
  onChange: (value: string) => void
  selectedValue: string
}

function SelectOption({
  label,
  icon,
  options,
  onChange,
  selectedValue,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const labelName = label.toLowerCase().split(' ')[0]
  const arrowAnimation = isOpen ? 'rotate-180' : ''
  const selectRef = React.useRef<HTMLDivElement>(null)

  const handleOptionClick = (value: string) => {
    setIsOpen(false)
    onChange(value)
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (
      selectRef.current &&
      !selectRef.current.contains(target)
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
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        className="flex items-center border-[3px] rounded-[10px] gap-5 px-[30px] relative"
        onClick={() => setIsOpen(!isOpen)}>
        <div className="py-[24px] [&>svg]:text-[24px]">
          {icon}
        </div>
        <span className="w-[3px] h-[30px] bg-[#f0eff2] rounded-xl"></span>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[2px] w-52 text-left">
            <label
              htmlFor={labelName}
              className="capitalize text-[#989b9b] text-[14px] font-medium">
              {label}
            </label>
            <p className="text-black font-medium text-[14px]">
              {selectedValue}
            </p>
          </div>
          <IoIosArrowUp
            className={clsx(
              arrowAnimation,
              'transition-all'
            )}
          />
        </div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
        className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            className={clsx(
              'block w-full px-4 py-2 text-sm text-left focus:outline-none',
              option.value === selectedValue
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            )}
            onClick={() => handleOptionClick(option.value)}>
            {option.label}
          </button>
        ))}
      </motion.div>
    </div>
  )
}

export default SelectOption
