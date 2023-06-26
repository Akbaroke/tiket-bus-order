import * as React from 'react'
import Search from '../../../components/Search'
import { LuSearch } from 'react-icons/lu'
import { useClickOutside } from '@mantine/hooks'
import {
  Buses,
  useSWRContext,
} from '../../../contexts/swr-context'
import {
  MdAirlineSeatReclineNormal,
  MdEventSeat,
  MdHotelClass,
} from 'react-icons/md'
import { BsFillBusFrontFill } from 'react-icons/bs'
import AddBus from './AddBus'
import EditBus from './EditBus'
import HeaderAdmin from '../../../components/Layouts/HeaderAdmin'

export default function ViewBus() {
  const swrContext = useSWRContext()
  const buses: Buses[] | undefined = swrContext?.buses
  const [isSearch, setIsSearch] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Buses[]
  >([])
  const ref = useClickOutside(() => setIsSearch(false))

  React.useEffect(() => {
    if (buses && search) {
      setSearchResult(filterSearch(search, buses))
    } else {
      setSearchResult(buses || [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buses, search])

  function filterSearch(
    search: string,
    buses: Buses[]
  ): Buses[] {
    const filteredSearch = buses.filter(
      item =>
        item.code
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
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

  return (
    <div className="p-10">
      <HeaderAdmin title="list bus">
        {isSearch ? (
          <Search
            ref={ref}
            setClearValue={() => setSearch('')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
        ) : (
          <div
            className="grid place-items-center w-[37px] h-[37px] rounded-[10px] bg-white text-[22px] text-[#262626] shadow-lg [&>svg]:text-[16px] cursor-pointer"
            onClick={() => setIsSearch(!isSearch)}>
            <LuSearch />
          </div>
        )}
        <AddBus />
      </HeaderAdmin>
      {search.length > 0 ? (
        <h2 className="text-sm">
          <i>Search result for :</i>
          <b> {search}</b>
        </h2>
      ) : null}
      <div className="flex flex-wrap gap-[20px] mt-4">
        {searchResult.map(item => (
          <EditBus busId={item.id} key={item.id}>
            <div className="w-[199px] h-[110px] shadow-md hover:shadow-lg transition-shadow p-[15px] rounded-[5px] relative overflow-hidden flex flex-col justify-between cursor-pointer">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h1 className="text-[18px] text-[#262626] font-medium leading-none">
                    {item.code}
                  </h1>
                  <p className="text-[#9F9F9F] text-[11px]">
                    {item.armada}
                  </p>
                </div>
                <div className="w-max h-max px-1 p border border-[#095BA8] flex gap-[2px] items-center rounded-[3px] bg-[#E3EEFF] text-[10px] text-[#095BA8] font-semibold [&>svg]:text-[12px]">
                  <MdAirlineSeatReclineNormal />
                  <p>{item.format}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-[#FF7200] flex gap-1 items-center justify-start">
                  <MdHotelClass className="text-[14px]" />
                  <p className="text-[12px] capitalize">
                    {item.class}
                  </p>
                </div>
                <div className="text-[#095BA8] flex gap-1 items-center justify-start -mt-[2px]">
                  <MdEventSeat className="text-[14px]" />
                  <p className="text-[12px] capitalize">
                    {item.seatingCapacity} Seats
                  </p>
                </div>
              </div>
              <BsFillBusFrontFill className="absolute block w-[132px] h-[125px] -top-[6px] -right-[10px] -z-10 text-[#095BA8]/5" />
            </div>
          </EditBus>
        ))}
      </div>
    </div>
  )
}
