export interface Tag {
    id: string
    label: string
}

export interface Company {
    name: string
    location: string
    tagIds: string[]
    careerPageUrl?: string
}
