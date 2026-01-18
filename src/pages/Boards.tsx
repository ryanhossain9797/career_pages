import { useData } from '../context/DataContext'
import { BOARD_TYPE_LABELS, BoardType } from '../types/company'
import './Boards.css'

export function Boards() {
    const { data, loading, error } = useData()

    if (loading) return <div className="boards-container"><div className="card large" style={{ borderStyle: 'dashed', opacity: 0.5 }}>LOADING BOARDS...</div></div>
    if (error) return <div className="boards-container"><div className="card large" style={{ borderStyle: 'dashed', opacity: 0.5 }}>ERROR: {error}</div></div>

    const boards = data?.boards || []

    // Group boards by type
    const groupedBoards = boards.reduce((acc, board) => {
        if (!acc[board.type]) {
            acc[board.type] = []
        }
        acc[board.type].push(board)
        return acc
    }, {} as Record<number, typeof boards>)

    return (
        <div className="boards-container">
            <header className="boards-header">
                <h1 className="hero-title">JOB BOARDS</h1>
                <p className="hero-subtitle">CURATED JOB BOARDS AND GROUPS FOR BANGLADESHI ENGINEERS.</p>
            </header>

            {Object.entries(groupedBoards).length > 0 ? (
                Object.entries(groupedBoards).map(([type, typeBoards]) => (
                    <section key={type} className="board-section">
                        <h2 className="section-title">{BOARD_TYPE_LABELS[Number(type) as BoardType]}</h2>
                        <div className="grid">
                            {typeBoards.map((board, index) => (
                                <section
                                    key={index}
                                    className="card board-card"
                                >
                                    <div className="card-id">BOARD_{String(index + 1).padStart(3, '0')}</div>
                                    <h3 className="card-title">{board.name}</h3>
                                    <div className="card-tags">
                                        <a
                                            href={board.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="tag link"
                                        >
                                            VISIT LINK ↗
                                        </a>
                                    </div>
                                </section>
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="card large" style={{ borderStyle: 'dashed', opacity: 0.5 }}>
                    <div className="card-subtitle">NO BOARDS FOUND AT THIS TIME.</div>
                </div>
            )}
        </div>
    )
}