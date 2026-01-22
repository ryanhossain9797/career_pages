import type { Company, Tag } from '../types/company'
import './CompanyCard.css'

interface CompanyCardProps {
    company: Company
    id: number
    tags: Tag[]
}

export function CompanyCard({ company, id, tags }: CompanyCardProps) {
    const isBroken = !company.name || !company.location || !company.tagIds;
    const displayId = id.toString().padStart(8, '0');

    if (isBroken) {
        return (
            <section
                className="card company-card broken"
            >
                <div className="broken-title">MALFORMED DATA</div>
                <div className="broken-subtitle">
                    {company.name || company.id || `INDEX: ${id}`}
                </div>
            </section>
        );
    }

    return (
        <section className="card company-card">
            <div className="card-id">{displayId}</div>
            <h2 className="card-title">{company.name}</h2>
            <div className="card-subtitle">{company.location}</div>
            <div className="card-tags">
                {company.tagIds.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return (
                        <span key={tagId} className="tag">
                            {tag?.label || "Unknown Tag"}
                        </span>
                    );
                })}
                {company.careerPageUrl && company.careerPageUrl.trim() !== "" && (
                    <a href={company.careerPageUrl} target="_blank" rel="noopener noreferrer" className="tag link">
                        CAREER PAGE ↗
                    </a>
                )}
                {company.linkedinUrl && company.linkedinUrl.trim() !== "" && (
                    <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="tag link">
                        LINKEDIN ↗
                    </a>
                )}
            </div>
        </section>
    );
}
