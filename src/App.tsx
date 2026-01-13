import './App.css'
import { CompanyCard } from './components/CompanyCard'
import { companies } from './data/companies'

function App() {

  return (
    <div className="container">
      <header>
        <div className="logo">
          BD <span>ENG</span> CAREERS
        </div>
        <nav>
          <div className="nav-links">
            <a href="#">COMPANIES</a>
            <a href="#">JOBS</a>
            <a href="#">RESOURCES</a>
          </div>
          <div className="nav-icons">
            {/* <div className="icon-box">●</div> */}
            {/* <div className="icon-box">▶</div> */}
            <div className="icon-box">EN</div>
          </div>
        </nav>
      </header>

      <main className="grid">
        <section className="card large">
          <div className="card-id">CATALOG / 2026</div>
          <h2 className="card-title" style={{ fontSize: '3rem' }}>BANGLADESH ENGINEERING CAREER PAGES</h2>
          <div className="card-subtitle">A curated directory of engineering opportunities.</div>
        </section>

        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </main>

      <footer>
        <div className="footer-item" style={{ gridColumn: 'span 2' }}>
          <div className="copyright">COPYRIGHT © 2026 BD ENG CAREERS. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  )
}

export default App
