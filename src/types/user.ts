export interface UserCompanyNote {
    id?: string;
    user_id: string;
    company_id: string;
    note: string;
    created_at?: Date;
    updated_at?: Date;
}
