import { Metadata } from "next";

import { fetchFilteredQuotationItems } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { CreateQuotationItem } from "@/app/ui/quotations/items/buttons";
import QuotationItemsTable from "@/app/ui/quotations/items/table";

export const metadata: Metadata = {
    title: "quotation items",
};

export default async function Page({
    params,
    searchParams,
}: {
    params: {
        id: string;
    };
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query?.toLowerCase() || "";
    const { id } = params;
    const quotationItems = await fetchFilteredQuotationItems(id, query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>견적서 관리</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search QuotationItems..." />
                <CreateQuotationItem id={id} />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <QuotationItemsTable quotationItems={quotationItems} />
            </Suspense>
        </div>
    );
}
