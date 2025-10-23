import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portal from './pages/portal/Portal'
import Intro from './pages/portal/Intro'
import Univers from './pages/portal/Univers'
import Reglement from './pages/portal/Reglement'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/univers" element={<Univers />} />
        <Route path="/reglement" element={<Reglement />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
