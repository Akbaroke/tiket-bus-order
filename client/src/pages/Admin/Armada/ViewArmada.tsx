import * as React from 'react'
import Search from '../../../components/Search'
import { LuSearch } from 'react-icons/lu'
import { useClickOutside } from '@mantine/hooks'
import {
  Armadas,
  useSWRContext,
} from '../../../contexts/swr-context'
import { Table } from '@mantine/core'
import AddArmada from './AddArmada'
import EditArmada from './EditArmada'
import DeleteArmada from './DeleteArmada'
import HeaderAdmin from '../../../components/Layouts/HeaderAdmin'

export default function ViewClass() {
  const swrContext = useSWRContext()
  const armadas: Armadas[] | undefined = swrContext?.armadas
  const [isSearch, setIsSearch] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Armadas[]
  >([])
  const ref = useClickOutside(() => setIsSearch(false))

  React.useEffect(() => {
    if (armadas && search) {
      setSearchResult(filterSearch(search, armadas))
    } else {
      setSearchResult(armadas || [])
      sortDataByUpdatedAt()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armadas, search])

  function filterSearch(
    search: string,
    armadas: Armadas[]
  ): Armadas[] {
    const filteredSearch = armadas.filter(item =>
      item.name
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    return filteredSearch
  }

  // Fungsi untuk membandingkan dua objek berdasarkan updated_at
  function compareByUpdatedAt(a: Armadas, b: Armadas): number {
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
      <HeaderAdmin title="list armada">
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
        <AddArmada />
      </HeaderAdmin>
      {search.length > 0 ? (
        <h2 className="text-sm">
          <i>Search result for :</i>
          <b> {search}</b>
        </h2>
      ) : null}
      <Table
        className="mt-3 bg-white"
        highlightOnHover
        withBorder
        withColumnBorders
        verticalSpacing="sm">
        <thead className="bg-[#F2F7FA]">
          <tr>
            <th>Armada Name</th>
            <th>Amount Bus</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResult.map(item => (
            <tr key={item.busFleetId}>
              <td className="capitalize">{item.name}</td>
              <td>{item.amount_bus}</td>
              <td className="flex gap-8">
                <EditArmada armadaId={item.busFleetId} />
                <DeleteArmada
                  armadaId={item.busFleetId}
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
