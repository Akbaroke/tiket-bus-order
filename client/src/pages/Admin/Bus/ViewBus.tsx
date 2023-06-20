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

interface Bus {
  id: string
  class: string
  seatingCapacity: string
  format: string
  armada: string
}

export default function ViewBus() {
  const [buses, setBuses] = React.useState<Bus[]>([])
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Bus[]
  >([])

  React.useEffect(() => {
    getAllBuses()
  }, [])

  React.useEffect(() => {
    if (buses && search) {
      setSearchResult(filterSearch(search, buses))
    } else {
      setSearchResult(buses || [])
    }
  }, [buses, search])

  function filterSearch(
    search: string,
    buses: Bus[]
  ): Bus[] {
    const filteredSearch = buses.filter(
      item =>
        item.class
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.seatingCapacity
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.format
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.armada
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    return filteredSearch
  }

  const getAllBuses = async (): Promise<void> => {
    const { data } = await axios.get(
      `${env.VITE_APP_URL}/bus`
    )
    setBuses(data.data)
  }

  return (
    <div className="p-10">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-5">
          <Search
            setClearValue={() => setSearch('')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
          <Link
            to="/admin/bus/add"
            className="grid place-items-center w-[48px] h-[48px] rounded-[10px] bg-[#0266FF] text-[22px] text-white shadow-lg">
            <HiPlus />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {searchResult.map(item => (
          <Link
            to={`/admin/bus/${item.id}`}
            key={item.id}
            className="p-5 rounded-[10px] shadow-lg w-[216px] h-[157px] relative">
            <HiRectangleGroup className="text-[71px] text-[#D2D2D2]" />
            <h1 className="font-semibold text-[20px] capitalize">
              {item.class}
            </h1>
            <div className="flex justify-start items-center gap-1 text-[#0266FF]">
              <MdReduceCapacity className="text-[18px]" />
              <p className="text-[18px] font-medium">
                {item.seatingCapacity}
              </p>
            </div>
            {item.armada}
            <div className="px-1 border border-[#5799FF] bg-[#E3EEFF] rounded-[3px] w-max h-max flex justify-center items-center gap-1 text-[#5799FF] absolute top-7 right-4">
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
