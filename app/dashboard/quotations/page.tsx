import { Metadata } from "next";

import { fetchFilteredQuotations } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import QuotationsTable from "@/app/ui/quotations/table";
import { CreateQuotation } from "@/app/ui/quotations/buttons";

export const metadata: Metadata = {
    title: "quotation",
};

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || "";

    const quotations = await fetchFilteredQuotations(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Quotations</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..." />
                <CreateQuotation />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <QuotationsTable quotations={quotations} />
            </Suspense>
        </div>
    );
}
