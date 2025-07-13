import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import ForgotPassword from './pages/ForgotPassword'
import Game from './pages/Game'
import Lobby from './pages/Lobby'
import Login from './pages/Login'
import Register from './pages/Register'
import WaitingRoom from './pages/WaitingRoom'

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
      <div className="App">
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game/:roomId" element={<Game />} />
            <Route path="/waiting-room/:roomId" element={<WaitingRoom />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
