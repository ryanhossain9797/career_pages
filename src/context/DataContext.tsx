import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { PageData } from '../data/companies'

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
                const response = await fetch('/api/data')
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`)
                }

                const json = await response.json()
                setData(json)
                setLoading(false)
            } catch (err: any) {
                console.error('Error fetching data from Vercel API:', err)
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
