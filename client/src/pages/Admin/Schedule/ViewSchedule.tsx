import * as React from 'react'
import Search from '../../../components/Search'
import { LuSearch } from 'react-icons/lu'
import { useClickOutside } from '@mantine/hooks'
import {
  Schedules,
  useSWRContext,
} from '../../../contexts/swr-context'
import CardSchedule from '../../../components/CardSchedule'
import AddSchedule from './AddSchedule'
import HeaderAdmin from '../../../components/Layouts/HeaderAdmin'

export default function ViewSchedule() {
  const swrContext = useSWRContext()
  const schedules: Schedules[] | undefined =
    swrContext?.schedules
  const [isSearch, setIsSearch] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Schedules[]
  >([])
  const ref = useClickOutside(() => setIsSearch(false))

  React.useEffect(() => {
    if (schedules && search) {
      setSearchResult(filterSearch(search, schedules))
    } else {
      setSearchResult(schedules || [])
      sortDataByUpdatedAt()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, search])

  function filterSearch(
    search: string,
    schedules: Schedules[]
  ): Schedules[] {
    const filteredSearch = schedules.filter(
      item =>
        item.code
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.className
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.name_bus_fleet
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.price
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.station_from
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.city_station_from
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    return filteredSearch
  }

  function compareByUpdatedAt(
    a: Schedules,
    b: Schedules
  ): number {
    if (a.updated_at > b.updated_at) {
      return -1
    }
    if (a.updated_at < b.updated_at) {
      return 1
    }
    return 0
  }

  function sortDataByUpdatedAt(): void {
    setSearchResult(prevSearchResult =>
      [...prevSearchResult].sort(compareByUpdatedAt)
    )
  }

  return (
    <div className="p-10">
      <HeaderAdmin title="list schedule">
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
        <AddSchedule />
      </HeaderAdmin>
      {search.length > 0 ? (
        <h2 className="text-sm">
          <i>Search result for :</i>
          <b> {search}</b>
        </h2>
      ) : null}
      <div className="flex flex-wrap gap-[20px] mt-4">
        {searchResult.map(item => (
          <CardSchedule key={item.busId} data={item} />
        ))}
      </div>
    </div>
  )
}
