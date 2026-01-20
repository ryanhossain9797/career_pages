export interface Tag {
    id: string
    label: string
}

export interface Company {
    name: string
    location: string
    tagIds: string[]
    careerPageUrl?: string
    linkedinUrl?: string
}

export const BoardType = {
    FACEBOOK_GROUP: 1,
    WEBSITE: 2,
    LINKEDIN: 3,
} as const

export type BoardType = typeof BoardType[keyof typeof BoardType]

export interface Board {
    type: BoardType
    name: string
    url: string
}


export const BOARD_TYPE_LABELS: Record<BoardType, string> = {
    [BoardType.FACEBOOK_GROUP]: 'Facebook Group',
    [BoardType.WEBSITE]: 'Website',
    [BoardType.LINKEDIN]: 'LinkedIn',
}

