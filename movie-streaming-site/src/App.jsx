import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { LandingPage } from './pages/LandingPage'
import Favorites from './pages/Favorites'
import Contact from './pages/Contact'

export default function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/favorites' element={<Favorites />}></Route>
      <Route path='/contact' element={<Contact />}></Route>
    </Routes>
  )
}
