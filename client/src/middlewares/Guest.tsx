import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DecryptFromServer } from '../utils/Decrypt'
import { useLocation, useNavigate } from 'react-router-dom'
import { setUser } from '../redux/actions/user'
import { UserInfo } from '../redux/reducers/user'

type Props = {
  children: React.ReactNode
}

interface State {
  user: UserInfo
}

export default function Guest({ children }: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation().pathname
  const { email, role } = useSelector(
    (state: State) => state.user
  )

  const AuthLocation =
    location === '/signup' ? '/signup' : '/signin'

  const to_stores = localStorage.getItem('token')

  React.useEffect(() => {
    const setState = async () => {
      try {
        const result = await DecryptFromServer(
          to_stores || ''
        )
        console.log(result)
        dispatch(setUser(result))
      } catch (error) {
        console.error('Error decrypting data:', error)
        navigate(AuthLocation)
      }
    }

    const protectedAdminOnly = (): void => {
      if (role) {
        switch (role) {
          case 'admin':
            navigate('/admin')
            break
          case 'user':
            navigate('/')
            break
          default:
            navigate(AuthLocation)
            break
        }
      }
    }

    protectedAdminOnly()
    if (to_stores) {
      setState()
      protectedAdminOnly()
    } else {
      navigate(AuthLocation)
    }
  }, [
    dispatch,
    navigate,
    to_stores,
    email,
    role,
    AuthLocation,
  ])

  return children
}
