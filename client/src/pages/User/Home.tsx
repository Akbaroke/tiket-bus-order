import * as React from 'react'
import axios from '../../api'
import { env } from '../../vite-env.d'

function Home() {
  React.useEffect(() => {
    // kirimData()
  }, [])

  const kirimData = async () => {
    const { data } = await axios.post(
      `${env.VITE_APP_URL}/class/create`,
      {
        className: 'ekonomi',
        seatingCapacity: 60,
        encrypt:
          'RsuPdx8hPClP+pcsOM71Ilk8ddKnTePnJV7kkJSXentu2KEVhzkE6Wj16xR5S1JWO9neiyKbLgcV32BexyGodRz8Fuw8WbrU4j2ytcz6JYBzLRt9xe9yUTCXp16qmiaxYhol7aZvPcU3Z9IywtTF+0Pnf8Ok6bIRIfG11TM+jJJBisCvuKRN2wRbWKtzk08WYCLjJEWXKU5SvtQyOKAEWTclg9GjMp+GWCIXxJisqhjJdzOGHsLg5PFQPDvDXsppH4idTevQLtUBrQ==',
      }
    )

    console.log(data)
  }
  return <div>Home</div>
}

export default Home
