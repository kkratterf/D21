import { Button } from "@d21/design-system/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@d21/design-system/components/ui/command"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@d21/design-system/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@d21/design-system/components/ui/popover"
import { cn } from "@d21/design-system/lib/utils"
import type { useForm } from "react-hook-form"
import { useLocationSearch } from "./use-location-search"

interface LocationResult {
    place_id: number
    display_name: string
    lat: string
    lon: string
}

interface LocationSearchProps {
    form: ReturnType<typeof useForm<any>>
}

export function LocationSearch({ form }: LocationSearchProps) {
    const {
        searchResults,
        isSearching,
        searchValue,
        setSearchValue,
        searchLocation,
    } = useLocationSearch()

    const handleLocationSelect = (result: LocationResult) => {
        form.setValue('location', result.display_name)
        form.setValue('latitude', Number.parseFloat(result.lat))
        form.setValue('longitude', Number.parseFloat(result.lon))
        setSearchValue(result.display_name)
    }

    const renderSearchContent = () => {
        if (isSearching) {
            return (
                <div className='px-5 py-6 !text-description text-sm'>
                    Searching...
                </div>
            )
        }

        if (searchResults.length === 0) {
            return (
                <div className='px-5 py-6 !text-description text-sm'>
                    No results found. Try a different search.
                </div>
            )
        }

        return (
            <CommandGroup>
                {[...new Map(searchResults.map((item: LocationResult) => [item.place_id, item])).values()].map((result: LocationResult) => (
                    <CommandItem
                        key={result.place_id}
                        value={result.place_id.toString()}
                        onSelect={() => handleLocationSelect(result)}
                        className="cursor-pointer"
                    >
                        <span className='w-full line-clamp-1'>
                            {result.display_name.split(',')[0]} <span className="text-description"> | {result.display_name.split(',').slice(1).join(',').trim()}</span>
                        </span>
                    </CommandItem>
                ))}
            </CommandGroup>
        )
    }

    return (
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>Location
                        <span className="text-description"> *</span>
                    </FormLabel>
                    <FormControl className="w-full">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className={cn('line-clamp-1 w-full min-w-0 max-w-[384px] justify-between overflow-hidden truncate py-1 text-left font-normal text-description', field.value && '!text')}
                                >
                                    {field.value || "Enter your location..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className='p-0 w-[--radix-popover-trigger-width]'
                                align="start"
                                sideOffset={4}
                            >
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder="Search location..."
                                        value={searchValue}
                                        onValueChange={(value) => {
                                            setSearchValue(value)
                                            searchLocation(value)
                                            if (!value) {
                                                form.setValue('location', '')
                                                form.setValue('latitude', 0)
                                                form.setValue('longitude', 0)
                                            }
                                        }}
                                    />
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {renderSearchContent()}
                                    </div>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
} 