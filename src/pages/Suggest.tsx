import './Suggest.css'

export function Suggest() {
    return (
        <div className="suggest-container">
            <div className="card large">
                <div className="card-subtitle">CONTRIBUTE TO BD ENG CAREERS</div>
                <h2 style={{ color: 'var(--text-color)', marginBottom: '1.5rem' }}>Suggest a Change or Addition</h2>

                <p style={{ opacity: 0.8, lineHeight: '1.6', marginBottom: '2rem' }}>
                    We want to keep this list as accurate and exhaustive as possible. If you know of a company that should be here,
                    or if you see information that needs updating, please let us know.
                </p>

                <div className="suggestion-steps">
                    <div className="step">
                        <span className="step-number">1</span>
                        <p>Visit the main data source on GitHub Gist.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">2</span>
                        <p>Leave a comment with the company details or the correction needed.</p>
                    </div>
                </div>

                <a
                    href="https://gist.github.com/ryanhossain9797/8e53fb3e3e0812ec499ac5caeb9b642f"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="suggest-button"
                >
                    GO TO GIST & COMMENT
                </a>
            </div>
        </div>
    )
}
