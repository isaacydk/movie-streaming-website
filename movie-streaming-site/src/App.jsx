import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import Favorites from './pages/Favorites'
import Contact from './pages/Contact'

export default function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/favorites' element={<Favorites />}></Route>
      <Route path='/contact' element={<Contact />}></Route>
    </Routes>
  )
}
