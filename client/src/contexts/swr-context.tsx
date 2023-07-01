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
export interface Schedules {
  scheduleId: string
  remainingSeatCapacity: number
  busId: string
  code: string
  price: string
  station_from: string
  name_station_from: string
  city_station_from: string
  station_to: string
  name_station_to: string
  name_city_to: string
  date: string
  time: string
  format: string
  className: string
  seatingCapacity: string
  name_bus_fleet: string
  updated_at: string
}

type OrdersData = {
  code: string
  customer: string
  contact: string
  seat: number
}
export interface Orders {
  orderId: string
  scheduleId: string
  userId: string
  seatCount: number
  isPaid: 0 | 1
  totalPrice: number
  data: OrdersData[]
  expiredAt: number | null
  updatedAt: number
  createdAt: number
}

interface SWRContextValue {
  classes: Classes[]
  armadas: Armadas[]
  buses: Buses[]
  cities: Cities[]
  stations: Stations[]
  schedules: Schedules[]
  orders: Orders[]
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
  const scheduleFetch = async () => {
    const { data } = await axios.get('/schedule')
    return data.data
  }
  const orderFetch = async () => {
    const { data } = await axios.get('/order')
    return data.data
  }

  const { data: classes } = useSWR('/classes', classFetch)
  const { data: armadas } = useSWR('/armada', armadaFetch)
  const { data: buses } = useSWR('/bus', busFetch)
  const { data: cities } = useSWR('/city', cityFetch)
  const { data: stations } = useSWR('/station', stationFetch)
  const { data: schedules } = useSWR('/schedule', scheduleFetch)
  const { data: orders } = useSWR('/order', orderFetch)

  return (
    <SWRContext.Provider
      value={{
        classes,
        armadas,
        buses,
        cities,
        stations,
        schedules,
        orders,
      }}>
      {children}
    </SWRContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSWRContext = ():
  | SWRContextValue
  | undefined => React.useContext(SWRContext)
