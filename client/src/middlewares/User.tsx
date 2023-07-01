import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DecryptFromServer } from '../utils/Decrypt'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../redux/actions/user'
import { DataUser } from '../interfaces/store'

type Props = {
  children: React.ReactNode
}

interface State {
  user: DataUser
}

export default function User({ children }: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { email, role } = useSelector(
    (state: State) => state.user
  )

  const to_stores = localStorage.getItem('token')

  React.useEffect(() => {
    const setState = async () => {
      try {
        const result = await DecryptFromServer(to_stores || '')
        const newResult = Object.assign({
          userId: result.userId,
          email: result.email,
          role: result.role,
          encrypt: to_stores,
        })
        dispatch(setUser(newResult))
      } catch (error) {
        console.error('Error decrypting data:', error)
        navigate('/auth')
      }
    }

    const protectedAdminOnly = (): void => {
      if (role && role !== 'user') {
        navigate('/auth')
      }
    }

    protectedAdminOnly()
    if (to_stores) {
      setState()
      protectedAdminOnly()
    } else {
      navigate('/auth')
    }
  }, [dispatch, navigate, to_stores, email, role])

  return children
}
