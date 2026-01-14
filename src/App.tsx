import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Suggest } from './pages/Suggest'
import { DataProvider } from './context/DataContext'
import { CompanyReviews } from './pages/CompanyReviews'

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="container">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/suggest" element={<Suggest />} />
              <Route path="/reviews/:companyName" element={<CompanyReviews />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </DataProvider>
  )
}

export default App



