import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import KimiApp from './pages/KimiApp'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kimi-app" element={<KimiApp />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
