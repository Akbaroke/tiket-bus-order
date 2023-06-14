import * as React from 'react'
import clsx from 'clsx'
import Signin from './Signin'
import Signup from './Signup'

function Auth(): JSX.Element {
  const [switchForm, setSwitchForm] =
    React.useState<boolean>(false)

  const handleSwitchForm = (isSwitched: boolean) => {
    setSwitchForm(isSwitched)
  }

  const getSwitchFormClass = (isCurrentForm: boolean) => {
    return clsx(
      isCurrentForm
        ? 'bg-white text-black'
        : 'bg-transparent text-[#9F9F9F] cursor-pointer',
      'text-center text-[16px] font-semibold rounded-[10px] w-[200px] h-[50px] grid place-items-center'
    )
  }

  return (
    <div className="grid place-items-center min-h-screen">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-center items-center gap-1 mb-3">
          <h1 className="font-semibold text-black text-[22px]">
            Welcome Back
          </h1>
          <h3 className="font-medium text-[#CACACA] text-[14px]">
            Welcome Back, Please enter your details
          </h3>
        </div>
        <div className="bg-[#F0EFF2] rounded-[10px] p-[5px] flex mb-5">
          <div
            className={getSwitchFormClass(!switchForm)}
            onClick={() => handleSwitchForm(false)}>
            Sign In
          </div>
          <div
            className={getSwitchFormClass(switchForm)}
            onClick={() => handleSwitchForm(true)}>
            Signup
          </div>
        </div>
        {!switchForm ? <Signin /> : <Signup />}
      </div>
    </div>
  )
}

export default Auth
