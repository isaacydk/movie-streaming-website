import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { LandingPage } from './pages/LandingPage'
import Favorites from './pages/Favorites'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import Player from './pages/Player'
import Admin from './pages/Admin'

export default function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/favorites' element={<Favorites />}></Route>
      <Route path='/contact' element={<Contact />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/player/:id' element={<Player />}></Route>
      <Route path='/admin' element={<Admin />}></Route>
    </Routes>
  )
}
