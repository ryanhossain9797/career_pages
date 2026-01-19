import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./UserMenu.css";

export function UserMenu() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="user-menu-wrapper" ref={menuRef}>
            <button
                className="user-avatar-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User menu"
            >
                {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="avatar-img" />
                ) : (
                    <div className="avatar-placeholder">
                        {user.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="user-dropdown">
                    <div className="user-info">
                        <span className="user-name">{user.displayName}</span>
                        <span className="user-email">{user.email}</span>
                    </div>
                    <button className="logout-btn" onClick={signOut}>
                        SIGN OUT
                    </button>
                </div>
            )}
        </div>
    );
}
