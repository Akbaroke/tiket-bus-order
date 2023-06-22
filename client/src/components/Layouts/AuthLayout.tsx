import Tabs from '../Tabs'

type Props = {
  children: React.ReactNode
}

function AuthLayout({ children }: Props): JSX.Element {
  return (
    <div className="grid place-items-center min-h-[100dvh] p-8">
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="font-semibold text-black text-[22px]">
            Welcome Back
          </h1>
          <h3 className="font-medium text-[#CACACA] text-[14px]">
            Welcome Back, Please enter your details
          </h3>
        </div>
        <Tabs />
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
