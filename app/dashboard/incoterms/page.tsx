import { Metadata } from "next";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { CreateIncoterm } from "@/app/ui/incoterms/buttons";
import IncotermsTable from "@/app/ui/incoterms/table";
import { fetchFilteredIncoterms } from "@/app/lib/incoterms/data";

export const metadata: Metadata = {
    title: "Incoterm",
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

    const incoterms = await fetchFilteredIncoterms(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Incoterms</h1>
            </div>
            <div className="my-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Incoterms 검색..." />
                <CreateIncoterm />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <IncotermsTable incoterms={incoterms} />
            </Suspense>
        </div>
    );
}
