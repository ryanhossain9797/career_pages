import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './CompanyReviews.css'

interface Review {
    title: string
    role: string
    body: string
    readMoreLink: string | null
}

export function CompanyReviews() {
    const { companyName } = useParams<{ companyName: string }>()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!companyName) return

        setLoading(true)
        setError(null)
        setReviews([])

        // Use a CORS proxy to fetch the content
        const targetUrl = `https://deshimula.com/stories/1?SearchTerm=${encodeURIComponent(companyName)}&Vibe=0`
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`

        fetch(proxyUrl)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch reviews')
                return res.json()
            })
            .then(data => {
                try {
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(data.contents, 'text/html')

                    // Based on the user provided HTML, the review content and the "Read More" link
                    // are in separate sibling .col-12 divs wrapped in a .row div.
                    // So we iterate over .row to capture the full context.
                    const rowNodes = doc.querySelectorAll('.row')
                    const extractedReviews: Review[] = []

                    rowNodes.forEach(node => {
                        // Ensure this is a review node by checking for specific children
                        const titleNode = node.querySelector('.post-title')
                        const roleNode = node.querySelector('.reviewer-role')
                        const reviewBodyNode = node.querySelector('.company-review')

                        // Look for the Read More link anywhere within this row
                        const links = node.querySelectorAll('a')
                        let readMoreLink: string | null = null

                        links.forEach(link => {
                            const href = link.getAttribute('href')
                            const text = link.textContent?.trim().toLowerCase() || ''

                            if (href && (text.includes('read more') || href.includes('/story/'))) {
                                readMoreLink = href.startsWith('http') ? href : `https://deshimula.com${href}`
                            }
                        })

                        if (titleNode && reviewBodyNode) {
                            extractedReviews.push({
                                title: titleNode.textContent?.trim() || 'No Title',
                                role: roleNode?.textContent?.trim() || 'Anonymous',
                                body: reviewBodyNode.innerHTML, // Keep HTML for paragraphs
                                readMoreLink
                            })
                        }
                    })

                    setReviews(extractedReviews)
                    setLoading(false)
                } catch (e) {
                    console.error('Scraping error:', e)
                    setError('Failed to parse reviews')
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error('Fetch error:', err)
                setError(err.message)
                setLoading(false)
            })
    }, [companyName])

    return (
        <div className="reviews-container fade-in">
            <div className="card large">
                <div className="card-id">REVIEWS</div>
                <h2 className="card-title">{decodeURIComponent(companyName || '')}</h2>
                <div className="card-subtitle">
                    Data sourced from <a href="https://deshimula.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>deshimula.com</a>
                </div>
            </div>

            {loading && (
                <div className="card" style={{ marginTop: '1.5rem', borderStyle: 'dashed', opacity: 0.5, textAlign: 'center' }}>
                    <div className="card-subtitle">LOADING REVIEWS...</div>
                </div>
            )}

            {error && (
                <div className="card" style={{ marginTop: '1.5rem', borderStyle: 'dashed', borderColor: 'red', textAlign: 'center' }}>
                    <div className="card-subtitle" style={{ color: 'red' }}>ERROR: {error}</div>
                </div>
            )}

            {!loading && !error && reviews.length === 0 && (
                <div className="card" style={{ marginTop: '1.5rem', borderStyle: 'dashed', opacity: 0.5, textAlign: 'center' }}>
                    <div className="card-subtitle">NO REVIEWS FOUND ON DESHIMULA.COM</div>
                </div>
            )}

            <div className="reviews-grid">
                {reviews.map((review, index) => (
                    <div key={index} className="card review-card">
                        <div className="review-header">
                            <span className="review-role">{review.role}</span>
                        </div>
                        <h3 className="review-title">{review.title}</h3>
                        <div className="review-body" dangerouslySetInnerHTML={{ __html: review.body }} />

                        {review.readMoreLink && (
                            <a href={review.readMoreLink} target="_blank" rel="noopener noreferrer" className="read-more-link">
                                READ MORE ON DESHIMULA →
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
