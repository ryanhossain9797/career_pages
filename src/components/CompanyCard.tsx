import type { Company } from '../types/company'
import { getTagById } from '../data/companies'
import './CompanyCard.css'

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
                {company.tagIds.map(tagId => {
                    const tag = getTagById(tagId);
                    return (
                        <span key={tagId} className="tag">
                            {tag?.label || "Unknown Tag"}
                        </span>
                    );
                })}
                {company.careerPageUrl && (
                    <a href={company.careerPageUrl} target="_blank" rel="noopener noreferrer" className="tag link">
                        CAREER PAGE ↗
                    </a>
                )}
            </div>
        </section>
    )
}
