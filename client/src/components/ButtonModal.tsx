import * as React from 'react'
import clsx from 'clsx'
import { RxCross2 } from 'react-icons/rx'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

type ButtonProps = {
  className?: string
  text: string
  children?: React.ReactElement
  disabled?: boolean
  isLoading?: boolean
  title: string
  modalButtonAction: () => void
  modalButtonText: string
  cancelButtonText: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const modalVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export default function ButtonModal({
  className,
  text,
  disabled,
  children,
  isLoading,
  title,
  modalButtonAction,
  modalButtonText,
  cancelButtonText,
  ...props
}: ButtonProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        {...props}
        onClick={toggleModal}
        disabled={isLoading || disabled}
        className={clsx(
          'flex items-center justify-center gap-x-2 py-2 rounded-[10px] [&>svg]:w-5 [&>svg]:h-5 bg-[#0266FF] active:scale-95 transition-all cursor-pointer',
          className,
          disabled && 'bg-gray-400',
          isLoading && 'bg-gray-400 cursor-wait'
        )}>
        {text}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 z-10 w-screen h-screen overflow-hidden bg-black/50 grid place-items-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}>
            <div className="w-[300px] h-max bg-white rounded-xl">
              <div className="p-4 border border-x-0 border-t-0 border-b-gray-200 flex justify-between items-center">
                <p className="text-[18px] font-semibold">
                  {title}
                </p>
                <div
                  className="cursor-pointer w-8 h-8 rounded-xl hover:bg-gray-100 grid place-items-center text-black"
                  onClick={toggleModal}>
                  <RxCross2 />
                </div>
              </div>
              <div className="p-4 min-h-[80px]">
                {children}
              </div>
              <div className="flex justify-center gap-4 p-5">
                <Button
                  type="button"
                  text={cancelButtonText}
                  onClick={toggleModal}
                  className="bg-red-600 p-3 text-sm"
                />
                <Button
                  type="button"
                  text={modalButtonText}
                  onClick={() => {
                    modalButtonAction()
                    toggleModal()
                  }}
                  className="bg-blue-600 p-3 text-sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
