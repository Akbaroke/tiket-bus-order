import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DecryptFromServer } from '../utils/Decrypt'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../redux/actions/user'
import { UserInfo } from '../redux/reducers/user'

type Props = {
  children: React.ReactNode
}

interface State {
  user: UserInfo
}

export default function Admin({ children }: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { email, role } = useSelector(
    (state: State) => state.user
  )

  const to_stores = localStorage.getItem('token')

  React.useEffect(() => {
    const setState = async () => {
      try {
        const result = await DecryptFromServer(
          to_stores || ''
        )
        const newResult = Object.assign({
          email: result.email,
          role: result.role,
          encrypt: to_stores,
        })
        console.log(newResult)
        dispatch(setUser(newResult))
      } catch (error) {
        console.error('Error decrypting data:', error)
        navigate('/')
      }
    }

    const protectedAdminOnly = (): void => {
      if (role && role !== 'admin') {
        navigate('/home')
      }
    }

    protectedAdminOnly()
    if (to_stores) {
      setState()
      protectedAdminOnly()
    } else {
      navigate('/')
    }
  }, [dispatch, navigate, to_stores, email, role])

  return children
}
