import type { Company, Tag } from '../types/company'
import data from './data.json'

export const tags: Tag[] = data.tags
export const companies: Company[] = data.companies

export const getTagById = (id: string) => tags.find(t => t.id === id)

