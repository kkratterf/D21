import { Button } from "@d21/design-system/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@d21/design-system/components/ui/command"
import {
    FormControl,
    FormDescription,
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
import { Tag } from "@d21/design-system/components/ui/tag"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { useForm } from "react-hook-form"

import { getUserDirectoryTags } from "@/actions/directory"

interface DirectoryTagInputProps {
    form: ReturnType<typeof useForm<{ tags: string[] }>>
}

export function DirectoryTagInput({ form }: DirectoryTagInputProps) {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [availableTags, setAvailableTags] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Get current tags from form value - ensure it's always an array
    const currentTags = form.watch("tags") || []

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true)
            try {
                const tags = await getUserDirectoryTags()
                setAvailableTags(tags)
            } catch (error) {
                // Errore nel caricamento dei tag
            } finally {
                setIsLoading(false)
            }
        }

        fetchTags()
    }, [])

    const handleTagSelect = (tag: string) => {
        if (currentTags.length >= 5) {
            return
        }

        const newTags = [...currentTags, tag]
        form.setValue("tags", newTags)
        setOpen(false)
        setSearchValue("")
    }

    const handleTagRemove = (tagToRemove: string) => {
        const newTags = currentTags.filter((tag: string) => tag !== tagToRemove)
        form.setValue("tags", newTags)
    }

    const handleCreateTag = () => {
        if (!searchValue.trim() || currentTags.length >= 5) {
            return
        }

        const newTag = searchValue.trim()
        if (!currentTags.includes(newTag)) {
            const newTags = [...currentTags, newTag]
            form.setValue("tags", newTags)
        }
        setOpen(false)
        setSearchValue("")
    }

    const filteredTags = availableTags.filter((tag: string) =>
        tag.toLowerCase().includes(searchValue.toLowerCase()) &&
        !currentTags.includes(tag)
    )

    const renderSearchContent = () => {
        if (isLoading) {
            return (
                <div className="p-4 text-muted-foreground text-sm">
                    Caricamento tag...
                </div>
            )
        }

        if (!searchValue.trim()) {
            return (
                <CommandGroup>
                    {availableTags
                        .filter((tag: string) => !currentTags.includes(tag))
                        .map((tag: string) => (
                            <CommandItem
                                key={tag}
                                value={tag}
                                onSelect={() => handleTagSelect(tag)}
                            >
                                {tag}
                            </CommandItem>
                        ))}
                </CommandGroup>
            )
        }

        return (
            <CommandGroup>
                {filteredTags.map((tag: string) => (
                    <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => handleTagSelect(tag)}
                    >
                        {tag}
                    </CommandItem>
                ))}
                <CommandItem
                    onSelect={handleCreateTag}
                >
                    Crea "{searchValue}"
                </CommandItem>
            </CommandGroup>
        )
    }

    return (
        <>
            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Tags *</FormLabel>
                        <FormControl>
                            <div className="flex flex-col gap-2">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            className="justify-between font-normal text-description"
                                            onClick={(e) => {
                                                if (currentTags.length >= 5) {
                                                    e.preventDefault();
                                                    return;
                                                }
                                                setOpen(true);
                                            }}
                                        >
                                            {currentTags.length > 0 ? (
                                                <div className="flex flex-wrap gap-0.5">
                                                    {currentTags.map((tag: string) => (
                                                        <Tag
                                                            key={tag}
                                                            variant="neutral"
                                                            className='flex items-center gap-0.5 rounded-full border-border bg-background text-description'
                                                        >
                                                            {tag}
                                                            <div
                                                                aria-label={`Remove ${tag} tag`}
                                                                className='flex h-4 w-4 cursor-pointer items-center justify-center border-0 bg-transparent p-0 hover:bg-transparent'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleTagRemove(tag);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.stopPropagation();
                                                                        handleTagRemove(tag);
                                                                    }
                                                                }}
                                                            >
                                                                <X className="!stroke-icon hover:!stroke-icon-hover !size-3" />
                                                            </div>
                                                        </Tag>
                                                    ))}
                                                </div>
                                            ) : (
                                                "Aggiungi tag..."
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                                        <Command>
                                            <CommandInput
                                                placeholder="Cerca o crea tag..."
                                                value={searchValue}
                                                onValueChange={setSearchValue}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && searchValue.trim()) {
                                                        e.preventDefault()
                                                        handleCreateTag()
                                                    }
                                                }}
                                            />
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {renderSearchContent()}
                                            </div>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </FormControl>
                        {currentTags.length > 4 ? (
                            <FormDescription>
                                Puoi aggiungere fino a 5 tag
                            </FormDescription>
                        ) : null}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
} 