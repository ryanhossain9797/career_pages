import { useState, useEffect } from 'react'
import './App.css'
import { CompanyCard } from './components/CompanyCard'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { SearchBar } from './components/SearchBar'
import { Hero } from './components/Hero'
import { DATA_URL, type PageData } from './data/companies'

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

  return (
    <div className="container">
      <Header />

      <main>
        <Hero />

        {loading || error ? (
          <div className="grid" style={{ marginTop: '1.5rem' }}>
            <div className="card large" style={{ borderStyle: 'dashed', opacity: 0.5 }}>
              <div className="card-subtitle">
                {loading ? 'LOADING OPPORTUNITIES...' : `ERROR: ${error}`}
              </div>
            </div>
          </div>
        ) : (
          <>
            <SearchBar
              nameSearch={nameSearch}
              setNameSearch={setNameSearch}
              tagSearch={tagSearch}
              setTagSearch={setTagSearch}
            />

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
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App



