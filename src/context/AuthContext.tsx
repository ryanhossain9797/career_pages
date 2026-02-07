import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    type User
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            if (error.code !== "auth/popup-closed-by-user") {
                alert(`Sign-in error: ${error.message}`);
            }
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            console.error("Error signing out", error);
            alert(`Sign-out error: ${error.message}`);
        }
    };

    const value = useMemo(() => ({
        user,
        loading,
        signInWithGoogle,
        signOut
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
