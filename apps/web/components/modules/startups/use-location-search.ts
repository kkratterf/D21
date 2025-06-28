import { useCallback, useEffect, useRef, useState } from 'react'

interface LocationResult {
    place_id: number
    display_name: string
    lat: string
    lon: string
}

export function useLocationSearch() {
    const [searchResults, setSearchResults] = useState<LocationResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const searchLocation = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            )
            const data = await response.json()
            setSearchResults(data)
        } catch (error) {
            console.error('Error searching location:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }, [])

    const debouncedSearch = useCallback((query: string) => {
        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        // Set new timeout
        debounceTimeoutRef.current = setTimeout(() => {
            searchLocation(query)
        }, 300)
    }, [searchLocation])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [])

    return {
        searchResults,
        isSearching,
        searchValue,
        setSearchValue,
        searchLocation: debouncedSearch,
    }
} 