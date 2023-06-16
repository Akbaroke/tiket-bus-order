import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { DataUser } from '../interfaces/store'

export const useUser = create(
  devtools(set => {
    return {
      email: '',
      role: '',
      setUser: (data: DataUser) => {
        set(() => {
          return {
            email: data.email,
            role: data.role,
          }
        })
      },
      resetUser: () => {
        set(() => {
          return {
            email: '',
            role: '',
          }
        })
      },
    }
  })
)
