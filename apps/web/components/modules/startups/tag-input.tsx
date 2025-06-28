import { getTags } from "@/actions/tags"
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

interface TagInputProps {
    form: ReturnType<typeof useForm<any>>
    directoryId: string
}

export function TagInput({ form, directoryId }: TagInputProps) {
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
                if (!directoryId) {
                    throw new Error("No directory ID provided")
                }
                const tags = await getTags(directoryId)
                setAvailableTags(tags)
            } catch (error) {
                setAvailableTags([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchTags()
    }, [directoryId])

    const handleTagSelect = (tag: string) => {
        if (currentTags.length >= 2) {
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
        if (!searchValue.trim() || currentTags.length >= 2) {
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
                    Loading tags...
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
                    Create "{searchValue}"
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
                        <FormLabel>Tags <span className='text-description'>*</span></FormLabel>
                        <FormControl>
                            <div className="flex flex-col gap-2">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            className="justify-between font-normal text-description"
                                            onClick={(e) => {
                                                if (currentTags.length >= 2) {
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
                                                "Add tags..."
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                                        <Command>
                                            <CommandInput
                                                placeholder="Search tags..."
                                                value={searchValue}
                                                onValueChange={setSearchValue}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !filteredTags.length) {
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
                        {currentTags.length > 1 ? (
                            <FormDescription>
                                You can select up to 2 tags
                            </FormDescription>
                        ) : null}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
} 