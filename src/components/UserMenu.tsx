import { signIn, signOut, useSession } from "../lib/auth-client";
import { LogOut, User } from "lucide-react";
import './UserMenu.css';

export function UserMenu() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return <div className="user-menu-loading">...</div>;
    }

    if (session) {
        return (
            <div className="user-menu">
                <div className="user-avatar-box" title={session.user.name ?? 'User'}>
                    {session.user.image ? (
                        <img src={session.user.image} alt="" className="user-avatar" />
                    ) : (
                        <User size={18} />
                    )}
                </div>
                <button
                    onClick={() => signOut()}
                    className="auth-btn sign-out-btn"
                    title="Sign Out"
                >
                    <LogOut size={16} />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn.social({ provider: 'google' })}
            className="auth-btn sign-in-btn"
        >
            SIGN IN
        </button>
    );
}
