import * as React from 'react'
import axios from '../api'
import useSWR from 'swr'

type Props = {
  children: React.ReactNode
}

export interface Classes {
  classId: string
  className: string
  format: string
  seatingCapacity: string
  updated_at: string
}
export interface Armadas {
  busFleetId: string
  name: string
  amount_bus: string
  updated_at: string
}
export interface Buses {
  id: string
  code: string
  busFleetId: string
  id_class: string
  class: string
  seatingCapacity: string
  format: string
  armada: string
}
export interface Cities {
  cityId: string
  name: string
  amount_station: string
  updated_at: string
}
export interface Stations {
  stationId: string
  id_city: string
  name: string
  city: string
}

interface SWRContextValue {
  classes: Classes[]
  armadas: Armadas[]
  buses: Buses[]
  cities: Cities[]
  stations: Stations[]
}

export const SWRContext = React.createContext<
  SWRContextValue | undefined
>(undefined)

export const SWRProvider = ({ children }: Props) => {
  const classFetch = async () => {
    const { data } = await axios.get('/classes')
    return data.data
  }
  const armadaFetch = async () => {
    const { data } = await axios.get('/busFleet')
    return data.data
  }
  const busFetch = async () => {
    const { data } = await axios.get('/bus')
    return data.data
  }
  const cityFetch = async () => {
    const { data } = await axios.get('/cities')
    return data.data
  }
  const stationFetch = async () => {
    const { data } = await axios.get('/station')
    return data.data
  }

  const { data: classes } = useSWR('/classes', classFetch)
  const { data: armadas } = useSWR('/armada', armadaFetch)
  const { data: buses } = useSWR('/bus', busFetch)
  const { data: cities } = useSWR('/city', cityFetch)
  const { data: stations } = useSWR('/station', stationFetch)

  return (
    <SWRContext.Provider
      value={{ classes, armadas, buses, cities, stations }}>
      {children}
    </SWRContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSWRContext = ():
  | SWRContextValue
  | undefined => React.useContext(SWRContext)
