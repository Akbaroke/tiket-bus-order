import * as React from 'react'
import Search from '../../../components/Search'
import { LuSearch } from 'react-icons/lu'
import { useClickOutside } from '@mantine/hooks'
import EditClass from './EditClass'
import {
  Classes,
  useSWRContext,
} from '../../../contexts/swr-context'
import AddClass from './AddClass'
import DeleteClass from './DeleteClass'
import { Table } from '@mantine/core'
import HeaderAdmin from '../../../components/Layouts/HeaderAdmin'

export default function ViewClass() {
  const swrContext = useSWRContext()
  const classes: Classes[] | undefined = swrContext?.classes
  const [isSearch, setIsSearch] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Classes[]
  >([])
  const ref = useClickOutside(() => setIsSearch(false))

  React.useEffect(() => {
    if (classes && search) {
      setSearchResult(filterSearch(search, classes))
    } else {
      setSearchResult(classes || [])
      sortDataByUpdatedAt()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes, search])

  function filterSearch(
    search: string,
    classes: Classes[]
  ): Classes[] {
    const filteredSearch = classes.filter(
      item =>
        item.className
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.format.toString().includes(search.toLowerCase()) ||
        item.seatingCapacity
          .toString()
          .includes(search.toLowerCase())
    )
    return filteredSearch
  }

  // Fungsi untuk membandingkan dua objek berdasarkan updated_at
  function compareByUpdatedAt(a: Classes, b: Classes): number {
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
      <HeaderAdmin title="list class">
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
        <AddClass />
      </HeaderAdmin>
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
            <th>Class Name</th>
            <th>Format Seat</th>
            <th>Seat Capcity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResult.map(item => (
            <tr key={item.classId}>
              <td className="capitalize">{item.className}</td>
              <td>{item.format}</td>
              <td>{item.seatingCapacity}</td>
              <td className="flex gap-8">
                <EditClass classId={item.classId} />
                <DeleteClass
                  classId={item.classId}
                  name={item.className}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
