"use client";

import { Check, } from "lucide-react"
import type * as React from "react"
import { useMemo, useState } from "react"

import { Button } from "@d21/design-system/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@d21/design-system/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@d21/design-system/components/ui/popover"
import { Separator } from "@d21/design-system/components/ui/separator"
import { Tag } from "@d21/design-system/components/ui/tag"
import { Tooltip } from "@d21/design-system/components/ui/tooltip";
import { cn } from "@d21/design-system/lib/utils"

interface FilterProps {
    icon?: React.ReactNode
    title?: string
    tooltip?: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
    selectedValues: Set<string>
    onFilterChange: (values: string[] | undefined) => void
    singleOption?: boolean
}

export function Filter({
    icon,
    title,
    tooltip,
    options,
    selectedValues,
    onFilterChange,
    singleOption = false,
}: FilterProps) {
    const [value, setValue] = useState("")

    const optionsToShow = useMemo(() => {
        const valueToLower = value.toLocaleLowerCase()
        return (options || []).filter((option) =>
            option.label.toLocaleLowerCase().includes(valueToLower)
        )
    }, [options, value])

    return (
        <Popover>
            <Tooltip content={tooltip} className='z-50 flex 2xl:hidden'>
                <PopoverTrigger asChild>
                    <Button variant="secondary" className='w-full border-dashed md:w-auto [&>svg]:stroke-2'>
                        {icon}
                        <span className='hidden 2xl:flex'>{title}</span>
                        {selectedValues?.size > 0 && (
                            <>
                                <Separator orientation="vertical" className="mx-1 h-4" />
                                <Tag
                                    variant="neutral"
                                    className='border-0 2xl:hidden'
                                >
                                    {selectedValues.size}
                                </Tag>
                                <div className='hidden space-x-1 2xl:flex'>
                                    {selectedValues.size > 2 ? (
                                        <Tag
                                            variant="neutral"
                                            className='border-0'
                                        >
                                            {selectedValues.size} selected
                                        </Tag>
                                    ) : (
                                        options
                                            .filter((option) => selectedValues.has(option.value))
                                            .map((option) => (
                                                <Tag
                                                    variant="neutral"
                                                    className='border-0'
                                                    key={option.value}
                                                >
                                                    {option.label}
                                                </Tag>
                                            ))
                                    )}
                                </div>
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
            </Tooltip>
            <PopoverContent className='w-[280px] p-0' align="start">
                <Command
                    shouldFilter={false}
                >
                    <CommandInput placeholder={title}
                        value={value}
                        onValueChange={(value) => setValue(value)}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {optionsToShow.map((option, index) => {
                                const isSelected = selectedValues.has(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            const newSelectedValues = new Set(selectedValues)
                                            if (isSelected) {
                                                newSelectedValues.delete(option.value)
                                            } else {
                                                //In case of single we want to have only 1 available, so let's clear before inserting
                                                if (singleOption) {
                                                    newSelectedValues.clear()
                                                }
                                                newSelectedValues.add(option.value)
                                            }
                                            const filterValues = Array.from(newSelectedValues)
                                            onFilterChange(filterValues.length ? filterValues : undefined)
                                        }}
                                    >
                                        <div className='flex w-full items-center'>
                                            <span className={cn('text line-clamp-1 w-full px-1', isSelected && "text-brand")}>
                                                {option.label}
                                            </span>

                                            {isSelected && <Check className='h-4 w-4 stroke-icon-brand' />}
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onFilterChange(undefined)}
                                        className='!text-description justify-center text-center'
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}