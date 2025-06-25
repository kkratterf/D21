import Link from "next/link"

import { SheetClose } from "@d21/design-system/components/ui/sheet"

import Pictogram from "@/components/ui/pictogram"

export const MobileTitle = () => {
    return (
        <SheetClose asChild>
            <Link href="/">
                <Pictogram size={32} />
            </Link>
        </SheetClose>
    )
}