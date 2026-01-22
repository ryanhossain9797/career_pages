import { useState } from 'react'
import './Home.css'
import { CompanyCard } from '../components/CompanyCard'
import { SearchBar } from '../components/SearchBar'
import { Hero } from '../components/Hero'
import { useData } from '../context/DataContext'

export function Home() {
    const { data, loading, error } = useData()
    const [nameSearch, setNameSearch] = useState('')
    const [tagSearch, setTagSearch] = useState('')

    const filteredCompanies = [...(data?.companies || [])]
        .filter(company => {
            const name = company.name || '';
            const tagIds = company.tagIds || [];

            const matchesName = name.toLowerCase().includes(nameSearch.toLowerCase())

            const tagQueries = tagSearch.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '')
            const matchesTags = tagQueries.length === 0 || tagQueries.some(query =>
                tagIds.some(tagId => {
                    const tag = data?.tags.find(t => t.id === tagId)
                    return tag?.label.toLowerCase().includes(query) || tagId.toLowerCase().includes(query)
                })
            )

            return matchesName && matchesTags
        })
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

    return (
        <>
            <Hero />

            {loading || error ? (
                <div className="grid" style={{ marginTop: '1.5rem' }}>
                    <div
                        className={`card large ${loading ? 'loading' : 'error'}`}
                    >
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
                            <div className="card large empty">
                                <div className="card-subtitle">NO COMPANIES MATCH YOUR SEARCH CRITERIA.</div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}
