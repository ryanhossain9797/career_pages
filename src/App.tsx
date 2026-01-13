import { useState } from 'react'
import './App.css'
import { CompanyCard } from './components/CompanyCard'
import { companies } from './data/companies'
import { CURRENT_YEAR } from './constants/app'

function App() {
  const [nameSearch, setNameSearch] = useState('')
  const [tagSearch, setTagSearch] = useState('')

  const filteredCompanies = companies.filter(company => {
    const matchesName = company.name.toLowerCase().includes(nameSearch.toLowerCase())

    const tagQueries = tagSearch.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '')
    const matchesTags = tagQueries.length === 0 || tagQueries.some(query =>
      company.tagIds.some(tagId => tagId.toLowerCase().includes(query))
    )

    return matchesName && matchesTags
  })

  return (
    <div className="container">
      <header>
        <div className="logo">
          BD <span>ENG</span> CAREERS
        </div>
        <nav>
          <div className="nav-links">
            <a href="#">COMPANIES</a>
            {/* <a href="#">JOBS</a> */}
            {/* <a href="#">RESOURCES</a> */}
          </div>
          <div className="nav-icons">
            {/* <div className="icon-box">●</div> */}
            {/* <div className="icon-box">▶</div> */}
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
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
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
