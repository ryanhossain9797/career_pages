import { CURRENT_YEAR } from '../constants/app'

export function Hero() {
    return (
        <div className="grid">
            <section className="card large">
                <div className="card-id">CATALOG / {CURRENT_YEAR}</div>
                <h2 className="card-title">BANGLADESH ENGINEERING CAREER PAGES</h2>
                <div className="card-subtitle">A curated directory of engineering opportunities.</div>
            </section>
        </div>
    )
}
