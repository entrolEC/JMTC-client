import { Metadata } from "next";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { CreateCtnr } from "@/app/ui/ctnrs/buttons";
import CtnrsTableAgGrid from "@/app/ui/ctnrs/table";
import { fetchFilteredCtnrs } from "@/app/lib/ctnrs/data";

export const metadata: Metadata = {
    title: "Ctnr",
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

    const ctnrs = await fetchFilteredCtnrs(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Ctnrs</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="CTNR 검색..." />
                <CreateCtnr />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <CtnrsTableAgGrid ctnrs={ctnrs} />
            </Suspense>
        </div>
    );
}
