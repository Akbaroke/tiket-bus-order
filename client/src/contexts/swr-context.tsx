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
}

interface SWRContextValue {
  classes: Classes[]
}

export const SWRContext = React.createContext<
  SWRContextValue | undefined
>(undefined)

export const SWRProvider = ({ children }: Props) => {
  const classFetch = async () => {
    const response = await axios.get('/classes')
    return response.data.data
  }

  const { data: classes } = useSWR('/classes', classFetch)

  return (
    <SWRContext.Provider value={{ classes }}>
      {children}
    </SWRContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSWRContext = ():
  | SWRContextValue
  | undefined => React.useContext(SWRContext)
