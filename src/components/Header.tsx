import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserMenu } from './UserMenu'
import './Header.css'
import { useEffect } from 'react'

interface HeaderProps {
    highlightSignIn: boolean;
    setHighlightSignIn: (highlight: boolean) => void;
}

export function Header({ highlightSignIn, setHighlightSignIn }: HeaderProps) {
    const { user, signInWithGoogle } = useAuth()

    useEffect(() => {
        let timer: number;
        if (highlightSignIn) {
            timer = setTimeout(() => {
                setHighlightSignIn(false);
            }, 3000); // Highlight for 3 seconds
        }
        return () => clearTimeout(timer);
    }, [highlightSignIn, setHighlightSignIn]);

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
                        <button
                            className={`login-btn ${highlightSignIn ? 'highlight' : ''}`}
                            onClick={signInWithGoogle}
                        >
                            SIGN IN
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
