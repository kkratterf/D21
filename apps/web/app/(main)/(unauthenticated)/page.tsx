import Hero from "@/components/modules/homepage/hero";
import prisma from "@/prisma/client";

const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;

export default function HomePage() {
    console.log(tables);
    return (
        <div className='flex flex-col justify-center items-center'>
            <Hero />
        </div>
    )
}