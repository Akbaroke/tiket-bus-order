import * as React from 'react'
import { env } from '../../vite-env.d'
import axios from 'axios'

function Home() {
  const [classBus, setClassBus] = React.useState('')

  React.useEffect(() => {
    kirimData()
  }, [])

  const kirimData = async () => {
    const { data } = await axios.post(
      `${env.VITE_APP_URL}/class/create`,
      {
        className: 'ekonomi',
        seatingCapacity: 60,
      }
    )
    // setClassBus(data)

    console.log(data)
  }

  return <div>Home</div>
}

export default Home
