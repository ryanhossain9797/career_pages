import { Link, NavLink } from 'react-router-dom'
import { UserMenu } from './UserMenu'
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
                    <NavLink to="/boards">BOARDS</NavLink>
                    <NavLink to="/suggest">SUGGEST</NavLink>
                </div>
                <div className="nav-icons">
                    <UserMenu />
                </div>
            </nav>
        </header>
    )
}
