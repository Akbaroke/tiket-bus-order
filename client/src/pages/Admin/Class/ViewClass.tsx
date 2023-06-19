import * as React from 'react'
import axios from '../../../api'
import { env } from '../../../vite-env.d'
import { HiRectangleGroup } from 'react-icons/hi2'
import {
  MdOutlineAirlineSeatReclineExtra,
  MdReduceCapacity,
} from 'react-icons/md'
import Search from '../../../components/Search'
import { HiPlus } from 'react-icons/hi'
import { Link } from 'react-router-dom'

interface Classes {
  classId: string
  className: string
  format: string
  seatingCapacity: string
  updated_at: string
  created_at: string
}

export default function ViewClass() {
  const [classes, setClasses] = React.useState<Classes[]>(
    []
  )
  const [seacrh, setSeacrh] = React.useState<string>('')

  React.useEffect(() => {
    getAllClasses()
  }, [])

  const getAllClasses = async () => {
    const { data } = await axios.get(
      `${env.VITE_APP_URL}/classes`
    )
    setClasses(data.data)
  }

  return (
    <div className="p-10">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-5">
          <Search
            setClearValue={() => setSeacrh('')}
            value={seacrh}
            onChange={e => setSeacrh(e.target.value)}
            className="flex-1"
          />
          <Link
            to="/admin/class/add"
            className="grid place-items-center w-[48px] h-[48px] rounded-[10px] bg-[#0266FF] text-[22px] text-white shadow-lg">
            <HiPlus />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {classes.map(item => (
          <Link
            to={`/admin/class/${item.classId}`}
            key={item.classId}
            className="p-5 rounded-[10px] shadow-lg w-[216px] h-[157px] relative">
            <HiRectangleGroup className="text-[71px] text-[#D2D2D2]" />
            <h1 className="font-semibold text-[20px] capitalize">
              {item.className}
            </h1>
            <div className="flex justify-start items-center gap-1 text-[#0266FF]">
              <MdReduceCapacity className="text-[18px]" />
              <p className="text-[18px] font-medium">
                {item.seatingCapacity}
              </p>
            </div>
            <div className="px-1 border border-[#5799FF] bg-[#E3EEFF] rounded-[3px] w-max h-max flex justify-center items-center gap-1 text-[#5799FF] absolute top-7 right-2">
              <MdOutlineAirlineSeatReclineExtra className="text-[12px] font-semibold" />
              <p className="text-[12px] font-medium">
                {item.format}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}