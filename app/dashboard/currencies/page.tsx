import { Metadata } from "next";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { fetchFilteredCurrencies } from "@/app/lib/currencies/data";
import { CreateCurrency } from "@/app/ui/currencies/buttons";
import CurrenciesTable from "@/app/ui/currencies/table";

export const metadata: Metadata = {
    title: "Currency",
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

    const currencies = await fetchFilteredCurrencies(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>통화</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="통화 검색..." />
                <CreateCurrency />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <CurrenciesTable currencies={currencies} />
            </Suspense>
        </div>
    );
}
