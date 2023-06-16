export interface DataUser {
  email: string
  role: 'user' | 'admin'
}

export interface UserState {
  email: string
  role: 'user' | 'admin'
  setUser: (data: DataUser) => void
  resetUser: () => void
}
