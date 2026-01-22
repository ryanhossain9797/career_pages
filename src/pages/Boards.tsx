import { BoardCard } from '../components/BoardCard'
import { useData } from '../context/DataContext'
import { BOARD_TYPE_LABELS, BoardType } from '../types/company'
import './Boards.css'

export function Boards() {
    const { data, loading, error } = useData()

    if (loading) return <div className="boards-container"><div className="card large loading">LOADING BOARDS...</div></div>
    if (error) return <div className="boards-container"><div className="card large error">ERROR: {error}</div></div>

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
            <header className="page-header">
                <h1 className="page-title">JOB BOARDS</h1>
                <p className="page-subtitle">CURATED JOB BOARDS AND GROUPS FOR BANGLADESHI ENGINEERS.</p>
            </header>

            {Object.entries(groupedBoards).length > 0 ? (
                Object.entries(groupedBoards).map(([type, typeBoards]) => (
                    <section key={type} className="board-section">
                        <h2 className="section-title">{BOARD_TYPE_LABELS[Number(type) as BoardType]}</h2>
                        <div className="grid">
                            {typeBoards.map((board, index) => (
                                <BoardCard key={index} board={board} index={index} />
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="card large empty">
                    <div className="card-subtitle">NO BOARDS FOUND AT THIS TIME.</div>
                </div>
            )}
        </div>
    )
}