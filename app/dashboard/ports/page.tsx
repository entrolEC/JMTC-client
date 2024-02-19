import { Metadata } from "next";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { CreatePort } from "@/app/ui/ports/buttons";
import PortsTable from "@/app/ui/ports/table";
import { fetchFilteredPorts } from "@/app/lib/ports/data";

export const metadata: Metadata = {
    title: "Port",
};

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query?.toLowerCase() || "";

    const ports = await fetchFilteredPorts(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Ports</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Port 검색..." />
                <CreatePort />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <PortsTable ports={ports} />
            </Suspense>
        </div>
    );
}
