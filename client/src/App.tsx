import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Router />
    </BrowserRouter>
  )
}
