import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function App() {
  return (
    <div className="app">
      <header className="header">Apple Store Malaysia</header>
      <main className="content">
        <h1>Welcome</h1>
        <p>Apple Store Malaysia</p>
      </main>
      <nav className="bottom-nav">
        <button>Home</button>
        <button>Shop</button>
        <button>Profile</button>
      </nav>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)