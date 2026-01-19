import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { PageData } from '../data/companies'
import type { Company, Tag, Board } from '../types/company'

interface DataContextType {
    data: PageData | null
    loading: boolean
    error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<PageData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch all collections in parallel
                const [companiesSnap, tagsSnap, boardsSnap] = await Promise.all([
                    getDocs(collection(db, 'companies')),
                    getDocs(collection(db, 'tags')),
                    getDocs(collection(db, 'boards'))
                ])

                const companies = companiesSnap.docs.map(doc => doc.data() as Company)
                const tags = tagsSnap.docs.map(doc => doc.data() as Tag)
                const boards = boardsSnap.docs.map(doc => doc.data() as Board)

                setData({
                    companies,
                    tags,
                    boards: boards.length > 0 ? boards : undefined
                })
                setLoading(false)
            } catch (err: any) {
                console.error('Error fetching data from Firestore:', err)
                setError(err.message || 'Failed to fetch data')
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <DataContext.Provider value={{ data, loading, error }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}
