import { Metadata } from "next";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { CreateQuotationItem } from "@/app/ui/quotations/items/buttons";
import QuotationItemsTableAgGrid from "@/app/ui/quotations/items/table";
import { fetchFilteredQuotationItems, fetchQuotationById } from "@/app/lib/quotations/data";
import { notFound } from "next/navigation";
import { fetchCurrencies } from "@/app/lib/currencies/data";

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
    const [quotationItems, quotation, currencies] = await Promise.all([
        fetchFilteredQuotationItems(id, query),
        fetchQuotationById(id),
        fetchCurrencies(),
    ]);

    if (!quotation) {
        notFound();
    }

    const sortedQuotationItems = quotationItems.sort((a, b) => a.position - b.position);
    const lastItemPosition = sortedQuotationItems[sortedQuotationItems.length - 1].position;
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>견적서 관리</h1>
            </div>
            <div className="my-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search QuotationItems..." />
                <CreateQuotationItem id={id} lastItemPosition={lastItemPosition} />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <QuotationItemsTableAgGrid quotationItems={sortedQuotationItems} quotation={quotation} currencies={currencies} />
            </Suspense>
        </div>
    );
}
