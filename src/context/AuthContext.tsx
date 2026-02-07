import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    type User
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import type { UserProfile } from "../types/user";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    toggleBookmark: (companyId: string, bookmarked: boolean) => Promise<void>;
    getNote: (companyId: string) => Promise<string | null>;
    saveNote: (companyId: string, note: string) => Promise<void>;
    deleteNote: (companyId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const syncUser = async (firebaseUser: User) => {
        console.log("Starting backend sync for user:", firebaseUser.uid);
        try {
            const idToken = await firebaseUser.getIdToken();

            const response = await fetch('/api/sync-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to sync user');
            }

            const profileData: UserProfile = await response.json();
            setProfile(profileData);
            console.log("Profile synced from backend successfully.");
        } catch (error) {
            console.error("Error syncing user profile via backend:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await syncUser(firebaseUser);
            } else {
                setProfile(null);
            }
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

    const toggleBookmark = async (companyId: string, bookmarked: boolean) => {
        if (!user) {
            console.warn("Cannot toggle bookmark: user not logged in");
            return;
        }

        try {
            const idToken = await user.getIdToken();

            const response = await fetch('/api/toggle-bookmark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ companyId, bookmarked })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to toggle bookmark');
            }

            const { bookmarkedCompanies } = await response.json();

            // Update local profile state
            setProfile((prev: UserProfile | null) => prev ? { ...prev, bookmarkedCompanies } : null);
        } catch (error: any) {
            console.error("Error toggling bookmark:", error);
            alert(`Bookmark error: ${error.message}`);
        }
    };

    const getNote = async (companyId: string): Promise<string | null> => {
        if (!user) {
            console.warn("Cannot get note: user not logged in");
            return null;
        }

        try {
            const idToken = await user.getIdToken();

            const response = await fetch(`/api/get-note?companyId=${companyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get note');
            }

            const { data } = await response.json();
            return data?.note || null;
        } catch (error: any) {
            console.error("Error getting note:", error);
            alert(`Get note error: ${error.message}`);
            return null;
        }
    };

    const saveNote = async (companyId: string, note: string): Promise<void> => {
        if (!user) {
            console.warn("Cannot save note: user not logged in");
            return;
        }

        try {
            const idToken = await user.getIdToken();

            const response = await fetch('/api/save-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ companyId, note })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save note');
            }

            // Update local profile state — add companyId to noteCompanyIds if not already present
            setProfile((prev: UserProfile | null) => {
                if (!prev) return null;
                const existing = prev.noteCompanyIds || [];
                if (existing.includes(companyId)) return prev;
                return { ...prev, noteCompanyIds: [...existing, companyId] };
            });
        } catch (error: any) {
            console.error("Error saving note:", error);
            alert(`Save note error: ${error.message}`);
        }
    };

    const deleteNote = async (companyId: string): Promise<void> => {
        if (!user) {
            console.warn("Cannot delete note: user not logged in");
            return;
        }

        try {
            const idToken = await user.getIdToken();

            const response = await fetch('/api/delete-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ companyId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete note');
            }

            // Update local profile state — remove companyId from noteCompanyIds
            setProfile((prev: UserProfile | null) => prev ? {
                ...prev,
                noteCompanyIds: (prev.noteCompanyIds || []).filter((id: string) => id !== companyId)
            } : null);
        } catch (error: any) {
            console.error("Error deleting note:", error);
            alert(`Delete note error: ${error.message}`);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setProfile(null);
        } catch (error: any) {
            console.error("Error signing out", error);
            alert(`Sign-out error: ${error.message}`);
        }
    };

    const value = useMemo(() => ({
        user,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        toggleBookmark,
        getNote,
        saveNote,
        deleteNote
    }), [user, profile, loading]);

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
