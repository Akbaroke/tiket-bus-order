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
        const result = await DecryptFromServer(
          to_stores || ''
        )
        console.log(result)
        dispatch(setUser(result))
      } catch (error) {
        console.error('Error decrypting data:', error)
        navigate('/signin')
      }
    }

    const protectedAdminOnly = (): void => {
      if (role && role !== 'user') {
        navigate('/signin')
      }
    }

    protectedAdminOnly()
    if (to_stores) {
      setState()
      protectedAdminOnly()
    } else {
      navigate('/signin')
    }
  }, [dispatch, navigate, to_stores, email, role])

  return children
}
