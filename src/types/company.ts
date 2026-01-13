export interface Tag {
    id: string
    label: string
}

export interface Company {
    id: string
    name: string
    location: string
    tagIds: string[]
    careerPageUrl?: string
}
