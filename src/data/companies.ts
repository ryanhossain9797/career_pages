import type { Company, Tag } from '../types/company'

export const DATA_URL = 'https://gist.githubusercontent.com/ryanhossain9797/8e53fb3e3e0812ec499ac5caeb9b642f/raw/9e972faecff4b979a52ad6fea3bbf4b7987b6060/career_page_data.json'

export interface PageData {
    tags: Tag[]
    companies: Company[]
}
