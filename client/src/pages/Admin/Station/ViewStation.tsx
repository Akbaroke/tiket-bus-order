import * as React from 'react'
import Search from '../../../components/Search'
import { LuSearch } from 'react-icons/lu'
import { useClickOutside } from '@mantine/hooks'
import {
  Stations,
  useSWRContext,
} from '../../../contexts/swr-context'
import { Table } from '@mantine/core'
import AddStation from './AddStation'
import EditStation from './EditStation'

export default function ViewStation() {
  const swrContext = useSWRContext()
  const stations: Stations[] | undefined = swrContext?.stations
  const [isSearch, setIsSearch] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Stations[]
  >([])
  const ref = useClickOutside(() => setIsSearch(false))

  React.useEffect(() => {
    if (stations && search) {
      setSearchResult(filterSearch(search, stations))
    } else {
      setSearchResult(stations || [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations, search])

  function filterSearch(
    search: string,
    stations: Stations[]
  ): Stations[] {
    const filteredSearch = stations.filter(
      item =>
        item.name
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.city
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    return filteredSearch
  }

  return (
    <div className="p-10">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[6px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              List Station
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/20"></span>
          </div>
          <div className="flex justify-end gap-[10px]">
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
            <AddStation />
          </div>
        </div>
      </div>
      {search.length > 0 ? (
        <h2 className="text-sm">
          <i>Search result for :</i>
          <b> {search}</b>
        </h2>
      ) : null}
      <Table
        className="mt-3"
        highlightOnHover
        withBorder
        withColumnBorders
        verticalSpacing="sm">
        <thead className="bg-[#F2F7FA]">
          <tr>
            <th>Stations Name</th>
            <th>City Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResult.map(item => (
            <tr key={item.stationId}>
              <td className="capitalize">{item.name}</td>
              <td>{item.city}</td>
              <td className="flex gap-8">
                <EditStation stationId={item.stationId} />
                {/* <DeleteClass
                  classId={item.classId}
                  name={item.className}
                /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
