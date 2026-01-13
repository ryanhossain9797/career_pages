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
        name: 'Cefalo',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://career.cefalo.com/#jobList'
    },
    {
        name: 'Enosis',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://enosisbd.pinpointhq.com/#js-careers-jobs-block'
    },
    {
        name: 'Field nation',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://jobs.lever.co/fieldnation?location=Dhaka&commitment=Full-time&department=&team=Software%20Development'
    },
    {
        name: 'IQVIA',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://jobs.iqvia.com/en/jobs?categories=IT+Infrastructure,IT+Design+and+Development,Software+Development+Engineering&locations=Bangladesh'
    },
    {
        name: 'Optimizely',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://careers.optimizely.com/search/?createNewAlert=false&q=&locationsearch=Dhaka&optionsFacetsDD_department=&optionsFacetsDD_country='
    },
    {
        name: 'Selise',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://selisegroup.com/about-us/#selise-career'
    },
    {
        name: 'SSL Wireless',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://sslwireless.com/jobs/'
    },
    {
        name: 'Therap',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://therap.hire.trakstar.com/'
    },
    {
        name: 'Relisource',
        location: 'DHAKA, BANGLADESH',
        tagIds: [],
        careerPageUrl: 'https://www.relisource.com/careers/'
    }
]

export const companies: Company[] = [...rawCompanies]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c, index) => ({
        ...c,
        id: (index + 1).toString().padStart(8, '0')
    }))

export const getTagById = (id: string) => tags.find(t => t.id === id)
