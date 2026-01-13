import './SearchBar.css'

interface SearchBarProps {
    nameSearch: string
    setNameSearch: (value: string) => void
    tagSearch: string
    setTagSearch: (value: string) => void
}

export function SearchBar({ nameSearch, setNameSearch, tagSearch, setTagSearch }: SearchBarProps) {
    return (
        <div className="search-grid">
            <input
                type="text"
                placeholder="FILTER BY NAME..."
                className="search-input"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
            />
            <input
                type="text"
                placeholder="FILTER BY TAGS (comma-seperated)..."
                className="search-input"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
            />
        </div>
    )
}
