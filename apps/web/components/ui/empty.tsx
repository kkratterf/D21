import { Inbox } from "lucide-react";

type EmptyProps = {
    title: string;
    description: string;
}

export const Empty = ({ title, description }: EmptyProps) => {
    return (
        <div className='flex h-full w-full flex-col items-center justify-center gap-2 px-10 py-20'>
            <Inbox className='size-10 stroke-1 stroke-icon' />
            <div className='flex flex-col items-center justify-center gap-1 text-center'>
                <h1 className='font-semibold text-lg'>{title}</h1>
                <p className='text-description text-sm'>{description}</p>
            </div>
        </div>
    );
}

export default Empty;