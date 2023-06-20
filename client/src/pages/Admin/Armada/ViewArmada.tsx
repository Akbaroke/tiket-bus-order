import * as React from 'react'
import axios from '../../../api'
import { env } from '../../../vite-env.d'
import { HiRectangleGroup } from 'react-icons/hi2'
import Search from '../../../components/Search'
import { HiPlus } from 'react-icons/hi'
import { Link } from 'react-router-dom'

interface Armada {
  busFleetId: string
  name: string
}

export default function ViewArmada() {
  const [armadas, setArmadas] = React.useState<Armada[]>([])
  const [search, setSearch] = React.useState<string>('')
  const [searchResult, setSearchResult] = React.useState<
    Armada[]
  >([])

  React.useEffect(() => {
    getAllArmadas()
  }, [])

  React.useEffect(() => {
    if (armadas && search) {
      setSearchResult(filterSearch(search, armadas))
    } else {
      setSearchResult(armadas || [])
    }
  }, [armadas, search])

  function filterSearch(
    search: string,
    armadas: Armada[]
  ): Armada[] {
    const filteredSearch = armadas.filter(item =>
      item.name
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    return filteredSearch
  }

  const getAllArmadas = async (): Promise<void> => {
    const { data } = await axios.get(
      `${env.VITE_APP_URL}/busFleet`
    )
    setArmadas(data.data)
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
            to="/admin/armada/add"
            className="grid place-items-center w-[48px] h-[48px] rounded-[10px] bg-[#0266FF] text-[22px] text-white shadow-lg">
            <HiPlus />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {searchResult.map(item => (
          <Link
            to={`/admin/armada/${item.busFleetId}`}
            key={item.busFleetId}
            className="p-5 rounded-[10px] shadow-lg w-[216px] h-[157px] relative">
            <HiRectangleGroup className="text-[71px] text-[#D2D2D2]" />
            <h1 className="font-semibold text-[20px] capitalize">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  )
}
