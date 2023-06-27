type Props = {
  title: string
  children: React.ReactNode
}

export default function HeaderAdmin({ title, children }: Props) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-[22px] text-[#095BA8] font-bold block pb-2 pr-10 border-b border-b-[#095BA8]/20 capitalize">
          {title}
        </h1>
        <div className="flex justify-end gap-[10px]">
          {children}
        </div>
      </div>
    </div>
  )
}
