import { Route, Routes } from 'react-router';
import Auth from '../pages/Auth/Auth'

export default function root() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
    </Routes>
  );
}
