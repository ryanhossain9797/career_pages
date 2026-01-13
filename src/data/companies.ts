import type { Company, Tag } from '../types/company'

export const tags: Tag[] = [
    { id: 'software', label: 'SOFTWARE' },
    { id: 'offshore', label: 'OFFSHORE' },
    { id: 'healthcare', label: 'HEALTHCARE' },
    { id: 'saas', label: 'SAAS' },
    { id: 'fintech', label: 'FINTECH' },
    { id: 'consulting', label: 'CONSULTING' },
    { id: 'marketplace', label: 'MARKETPLACE' },
    { id: 'data', label: 'DATA & ANALYTICS' },
    { id: 'dxp', label: 'DXP' },
    { id: 'telecom', label: 'TELECOM' },
    { id: 'ecommerce', label: 'ECOMMERCE' },
    { id: 'logistics', label: 'LOGISTICS' },
    { id: 'retail', label: 'RETAIL' },
]

const rawCompanies = [
    {
        name: 'Cefalo',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['software', 'offshore', 'consulting'],
        careerPageUrl: 'https://career.cefalo.com/#jobList'
    },
    {
        name: 'Enosis',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['software', 'offshore'],
        careerPageUrl: 'https://enosisbd.pinpointhq.com/#js-careers-jobs-block'
    },
    {
        name: 'Field nation',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['saas', 'marketplace'],
        careerPageUrl: 'https://jobs.lever.co/fieldnation?location=Dhaka&commitment=Full-time&department=&team=Software%20Development'
    },
    {
        name: 'IQVIA',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['healthcare', 'data'],
        careerPageUrl: 'https://jobs.iqvia.com/en/jobs?categories=IT+Infrastructure,IT+Design+and+Development,Software+Development+Engineering&locations=Bangladesh'
    },
    {
        name: 'Optimizely',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['saas', 'dxp'],
        careerPageUrl: 'https://careers.optimizely.com/search/?createNewAlert=false&q=&locationsearch=Dhaka&optionsFacetsDD_department=&optionsFacetsDD_country='
    },
    {
        name: 'Selise',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['software', 'consulting'],
        careerPageUrl: 'https://selisegroup.com/about-us/#selise-career'
    },
    {
        name: 'SSL Wireless',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['fintech', 'telecom'],
        careerPageUrl: 'https://sslwireless.com/jobs/'
    },
    {
        name: 'Therap',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['healthcare', 'saas'],
        careerPageUrl: 'https://therap.hire.trakstar.com/'
    },
    {
        name: 'Relisource',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['software', 'healthcare', 'logistics'],
        careerPageUrl: 'https://www.relisource.com/careers/'
    },
    {
        name: 'Chaldal',
        location: 'DHAKA, BANGLADESH',
        tagIds: ['ecommerce', 'logistics', 'retail'],
        careerPageUrl: 'https://chaldal.tech/'
    }
]

export const companies: Company[] = [...rawCompanies]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c, index) => ({
        ...c,
        id: (index + 1).toString().padStart(8, '0')
    }))

export const getTagById = (id: string) => tags.find(t => t.id === id)
