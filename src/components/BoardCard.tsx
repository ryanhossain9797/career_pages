import type { Board } from '../types/company'
import './BoardCard.css'

interface BoardCardProps {
    board: Board
    index: number
}

export function BoardCard({ board, index }: BoardCardProps) {
    const isBroken = !board.name || !board.url;
    const displayId = `BOARD_${String(index + 1).padStart(3, '0')}`;

    if (isBroken) {
        return (
            <section
                className="card board-card broken"
            >
                <div className="broken-title">MALFORMED DATA</div>
                <div className="broken-subtitle">
                    {board.name || displayId}
                </div>
            </section>
        );
    }

    return (
        <section className="card board-card">
            <div className="card-id">{displayId}</div>
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
    );
}
