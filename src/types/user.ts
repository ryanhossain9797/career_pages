export interface UserProfile {
    id: string;
    authUid: string;
    email: string;
    name: string;
    bookmarkedCompanies: string[];
}

export interface UserCompanyNote {
    id?: string;
    user_id: string;
    company_id: string;
    note: string;
    created_at?: Date;
    updated_at?: Date;
}
