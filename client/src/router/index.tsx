import { Route, Routes } from 'react-router';
import Auth from '../pages/Auth/Auth'
import Home from '../pages/User/Home'

export default function root() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}
