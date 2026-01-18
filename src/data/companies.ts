import type { Company, Tag, Board } from '../types/company'

// Using the version-less URL for the gist to ensure we always get the latest
export const DATA_URL = 'https://gist.githubusercontent.com/ryanhossain9797/8e53fb3e3e0812ec499ac5caeb9b642f/raw/career_page_data.json'

export interface PageData {
    tags: Tag[]
    companies: Company[]
    boards?: Board[]
}

