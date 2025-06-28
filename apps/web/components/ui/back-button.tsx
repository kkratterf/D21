"use client"

import { Button } from "@d21/design-system/components/ui/button";
import { Tooltip } from "@d21/design-system/components/ui/tooltip";
import { useIsMobile } from "@d21/design-system/hooks/useMobile";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackButton = ({ className }: { className?: string }) => {
    const router = useRouter();
    const isMobile = useIsMobile();

    return (
        <Tooltip content="Back" side="right" className="hidden md:flex">
            <Button size={isMobile ? "default" : "small"} variant="secondary" icon onClick={() => router.back()} className={className}>
                <ChevronLeft />
            </Button>
        </Tooltip>
    )
}