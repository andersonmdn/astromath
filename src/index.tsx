import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/globals.css'

import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container missing in index.html')
}

const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
)
