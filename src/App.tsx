import { useState, useEffect } from 'react'
import './App.css'
import { CompanyCard } from './components/CompanyCard'
import { DATA_URL, type PageData } from './data/companies'
import { CURRENT_YEAR } from './constants/app'

function App() {
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nameSearch, setNameSearch] = useState('')
  const [tagSearch, setTagSearch] = useState('')

  useEffect(() => {
    fetch(`${DATA_URL}?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data')
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredCompanies = data?.companies.filter(company => {
    const matchesName = company.name.toLowerCase().includes(nameSearch.toLowerCase())

    const tagQueries = tagSearch.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '')
    const matchesTags = tagQueries.length === 0 || tagQueries.some(query =>
      company.tagIds.some(tagId => tagId.toLowerCase().includes(query))
    )

    return matchesName && matchesTags
  }) || []

  if (loading) return <div className="container"><main><div className="card large"><div className="card-subtitle">LOADING OPPORTUNITIES...</div></div></main></div>
  if (error) return <div className="container"><main><div className="card large"><div className="card-subtitle" style={{ color: 'red' }}>ERROR: {error}</div></div></main></div>

  return (
    <div className="container">
      <header>
        <div className="logo">
          BD <span>ENG</span> CAREERS
        </div>
        <nav>
          <div className="nav-links">
            <a href="#">COMPANIES</a>
          </div>
          <div className="nav-icons">
            <div className="icon-box">EN</div>
          </div>
        </nav>
      </header>

      <main>
        <div className="grid">
          <section className="card large">
            <div className="card-id">CATALOG / {CURRENT_YEAR}</div>
            <h2 className="card-title">BANGLADESH ENGINEERING CAREER PAGES</h2>
            <div className="card-subtitle">A curated directory of engineering opportunities.</div>
          </section>
        </div>

        <div className="search-grid">
          <input
            type="text"
            placeholder="FILTER BY NAME..."
            className="search-input"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="FILTER BY TAGS (comma-seperated)..."
            className="search-input"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
          />
        </div>

        <div className="grid">
          {filteredCompanies.map((company, index) => (
            <CompanyCard key={index} company={company} id={index + 1} tags={data?.tags || []} />
          ))}
          {filteredCompanies.length === 0 && (
            <div className="card large" style={{ borderStyle: 'dashed', minHeight: '100px', opacity: 0.5 }}>
              <div className="card-subtitle">NO COMPANIES MATCH YOUR SEARCH CRITERIA.</div>
            </div>
          )}
        </div>
      </main>

      <footer>
        <div className="footer-item" style={{ gridColumn: 'span 2' }}>
          <div className="copyright">COPYRIGHT © {CURRENT_YEAR} BD ENG CAREERS. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  )
}

export default App

