import { Link, NavLink } from 'react-router-dom'
import './Header.css'

export function Header() {
    return (
        <header>
            <Link to="/" className="logo">
                BD <span>ENG</span> CAREERS
            </Link>
            <nav>
                <div className="nav-links">
                    <NavLink to="/" end>COMPANIES</NavLink>
                    <NavLink to="/suggest">SUGGEST</NavLink>
                </div>
                <div className="nav-icons">
                    <div className="icon-box">EN</div>
                </div>
            </nav>
        </header>
    )
}
