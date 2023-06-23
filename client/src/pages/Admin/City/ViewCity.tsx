import * as React from 'react'
import Search from '../../../components/Search'
import { LuSearch } from 'react-icons/lu'
import { useClickOutside } from '@mantine/hooks'
import {
  Cities,
  useSWRContext,
} from '../../../contexts/swr-context'
import { Table } from '@mantine/core'
import AddCity from './AddCity'
import EditCity from './EditCity'
import DeleteCity from './DeleteCity'

export default function ViewCity() {
  const swrContext = useSWRContext()
  const cities: Cities[] | undefined = swrContext?.cities
  const [isSearch, setIsSearch] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Cities[]
  >([])
  const ref = useClickOutside(() => setIsSearch(false))

  React.useEffect(() => {
    if (cities && search) {
      setSearchResult(filterSearch(search, cities))
    } else {
      setSearchResult(cities || [])
      sortDataByUpdatedAt()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, search])

  function filterSearch(
    search: string,
    cities: Cities[]
  ): Cities[] {
    const filteredSearch = cities.filter(
      item =>
        item.name
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.amount_station
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    return filteredSearch
  }

  // Fungsi untuk membandingkan dua objek berdasarkan updated_at
  function compareByUpdatedAt(a: Cities, b: Cities): number {
    if (a.updated_at > b.updated_at) {
      return -1
    }
    if (a.updated_at < b.updated_at) {
      return 1
    }
    return 0
  }

  // Mengurutkan data berdasarkan updated_at
  function sortDataByUpdatedAt(): void {
    setSearchResult(prevSearchResult =>
      [...prevSearchResult].sort(compareByUpdatedAt)
    )
  }

  return (
    <div className="p-10">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[6px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              List City
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
            <AddCity />
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
            <th>City Name</th>
            <th>Amount Station</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResult.map(item => (
            <tr key={item.cityId}>
              <td className="capitalize">{item.name}</td>
              <td>{item.amount_station}</td>
              <td className="flex gap-8">
                <EditCity cityId={item.cityId} />
                <DeleteCity
                  cityId={item.cityId}
                  name={item.name}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
