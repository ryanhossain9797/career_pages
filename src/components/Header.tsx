import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserMenu } from './UserMenu'
import './Header.css'

export function Header() {
    const { user, signInWithGoogle } = useAuth()

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
            </nav>

            <div className="nav-icons">
                {user ? (
                    <UserMenu />
                ) : (
                    <div className="user-menu-wrapper">
                        <button className="login-btn" onClick={signInWithGoogle}>
                            SIGN IN
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
