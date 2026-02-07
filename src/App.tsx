import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Suggest } from './pages/Suggest'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { UserDataProvider } from './context/UserDataContext'
import { CompanyReviews } from './pages/CompanyReviews'
import { Boards } from './pages/Boards'

function App() {
  const [highlightSignIn, setHighlightSignIn] = useState(false);

  return (
    <AuthProvider>
      <UserDataProvider>
        <DataProvider>
          <Router>
            <div className="container">
              <Header highlightSignIn={highlightSignIn} setHighlightSignIn={setHighlightSignIn} />

              <main>
                <Routes>
                  <Route path="/" element={<Home setHighlightSignIn={setHighlightSignIn} />} />
                  <Route path="/boards" element={<Boards />} />
                  <Route path="/suggest" element={<Suggest />} />
                  <Route path="/reviews/:companyName" element={<CompanyReviews />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </DataProvider>
      </UserDataProvider>
    </AuthProvider>
  )
}

export default App
