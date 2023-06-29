import * as React from 'react'
import { useParams } from 'react-router-dom'

export default function DetailOrder() {
  const { id } = useParams()

  return <div>DetailOrder : {id}</div>
}
