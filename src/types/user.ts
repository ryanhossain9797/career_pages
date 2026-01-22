export interface UserProfile {
    id: string; // Firestore auto-generated ID
    authUid: string; // The ID from the auth provider (e.g. Firebase Auth/Google)
    email: string | null;
    displayName: string | null;
    createdAt: string;
    lastLogin: string;
    bookmarkedCompanies?: string[]; // Array of company Firestore document IDs
}
