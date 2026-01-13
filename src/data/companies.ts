import type { Company, Tag } from '../types/company'

export const tags: Tag[] = [
    { id: 'software', label: 'SOFTWARE' },
    { id: 'offshore', label: 'OFFSHORE' },
    { id: 'healthcare', label: 'HEALTHCARE' },
    { id: 'saas', label: 'SAAS' },
    { id: 'fintech', label: 'FINTECH' },
    { id: 'consulting', label: 'CONSULTING' },
]

const rawCompanies = [
    {
        name: 'ENOSIS SOLUTIONS',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['software', 'offshore'],
        careerPageUrl: 'https://www.enosisbd.com/careers'
    },
    {
        name: 'THERAP (BD) LTD.',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['healthcare', 'saas'],
        careerPageUrl: 'https://therapbd.com/careers'
    },
    {
        name: 'SELISE',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['fintech', 'consulting'],
        careerPageUrl: 'https://selise.ch/career/'
    },
]

export const companies: Company[] = rawCompanies.map((c, index) => ({
    ...c,
    id: (index + 1).toString().padStart(8, '0')
}))

export const getTagById = (id: string) => tags.find(t => t.id === id)
