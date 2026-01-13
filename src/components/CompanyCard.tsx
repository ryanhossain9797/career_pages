import './CompanyCard.css'

interface Company {
    id: string
    name: string
    location: string
    tags: string[]
}

interface CompanyCardProps {
    company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
    return (
        <section className="card company-card">
            <div className="card-id">{company.id}</div>
            <h2 className="card-title">{company.name}</h2>
            <div className="card-subtitle">{company.location}</div>
            <div className="card-tags">
                {company.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
                <a href="#" className="tag link">CAREER PAGE ↗</a>
            </div>
        </section>
    )
}
