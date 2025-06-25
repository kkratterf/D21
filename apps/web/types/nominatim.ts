export interface NominatimResult {
    place_id: number
    licence: string
    osm_type: string
    osm_id: number
    boundingbox: string[]
    lat: string
    lon: string
    display_name: string
    class: string
    type: string
    importance: number
    icon?: string
    address?: {
        house_number?: string
        road?: string
        suburb?: string
        city?: string
        state?: string
        postcode?: string
        country?: string
        country_code?: string
    }
} 