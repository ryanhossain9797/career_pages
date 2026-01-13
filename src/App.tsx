import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Suggest } from './pages/Suggest'

function App() {
  return (
    <Router>
      <div className="container">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/suggest" element={<Suggest />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App



