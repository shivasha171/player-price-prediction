import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import './styles.css'

function App(){
  return (
    <BrowserRouter>
      <div className="max-w-3xl mx-auto p-4">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">CrickPredict (Demo)</h1>
          <nav className="mt-2 space-x-3">
            <Link to="/" className="underline">Home</Link>
            <Link to="/leaderboard" className="underline">Leaderboard</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
