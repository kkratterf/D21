"use client";

import { ArrowUpDown, Circle } from "lucide-react"
import type * as React from "react"
import { } from "react"

import { Button } from "@d21/design-system/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@d21/design-system/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@d21/design-system/components/ui/popover"
import { Tooltip } from "@d21/design-system/components/ui/tooltip";
import { cn } from "@d21/design-system/lib/utils"

interface SortProps {
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
    selectedValues: Set<string>
    onFilterChange: (values: string[] | undefined) => void
    singleOption?: boolean
}

export function Sort({
    options,
    selectedValues,
    onFilterChange,
    singleOption = false,
}: SortProps) {
    return (
        <Popover>
            <Tooltip
                content="Sort"
                className='z-50 flex lg:hidden'
            >
                <PopoverTrigger asChild className='hidden md:flex'>
                    <Button
                        variant="secondary"
                        className='w-full md:w-auto [&>svg]:stroke-2'
                    >
                        {selectedValues.size > 0 ? (
                            (() => {
                                const selectedOption = options.find(opt => selectedValues.has(opt.value))
                                const Icon = selectedOption?.icon
                                return Icon ? <Icon className="size-4" /> : <ArrowUpDown className="size-4" />
                            })()
                        ) : (
                            <ArrowUpDown className="size-4" />
                        )}
                        <span className='hidden lg:flex'>Sort</span>
                    </Button>
                </PopoverTrigger>
            </Tooltip>
            <PopoverContent className='w-[240px] p-0' align="start">
                <Command
                    shouldFilter={false}
                >
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            const newSelectedValues = new Set(selectedValues)
                                            if (!isSelected) {
                                                if (singleOption) {
                                                    newSelectedValues.clear()
                                                }
                                                newSelectedValues.add(option.value)
                                                const filterValues = Array.from(newSelectedValues)
                                                onFilterChange(filterValues)
                                            }
                                        }}
                                    >
                                        <span className={cn('text line-clamp-1 w-full px-1', isSelected && "text-brand")}>{option.label}</span>
                                        {isSelected && <span className='absolute right-3 flex size-2 items-center justify-center'>
                                            <Circle
                                                aria-hidden="true"
                                                className='size-full shrink-0 fill-current text-brand group-data-[state=checked]/DropdownMenuRadioItem:flex group-data-[state=unchecked]/DropdownMenuRadioItem:hidden'
                                            />
                                        </span>}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}