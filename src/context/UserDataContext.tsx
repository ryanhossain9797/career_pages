import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { type User } from "firebase/auth";
import type { UserProfile } from "../types/user";
import { useAuth } from "./AuthContext";

interface UserDataContextType {
    profile: UserProfile | null;
    loading: boolean;
    toggleBookmark: (companyId: string, bookmarked: boolean) => Promise<void>;
    getNote: (companyId: string) => Promise<string | null>;
    saveNote: (companyId: string, note: string) => Promise<void>;
    deleteNote: (companyId: string) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Sync user profile when auth user changes
    useEffect(() => {
        async function syncUser(firebaseUser: User | null) {
            if (!firebaseUser) {
                setProfile(null);
                setLoading(false);
                return;
            }

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
            } catch (error) {
                console.error("Error syncing user profile:", error);
                // Don't throw - user can still browse without profile
                setProfile(null);
            } finally {
                setLoading(false);
            }
        }

        syncUser(user);
    }, [user]);

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

    const value = useMemo(() => ({
        profile,
        loading,
        toggleBookmark,
        getNote,
        saveNote,
        deleteNote
    }), [profile, loading]);

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
}

export function useUserData() {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error("useUserData must be used within a UserDataProvider");
    }
    return context;
}
