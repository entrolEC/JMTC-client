import { Metadata } from "next";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import QuotationsTable from "@/app/ui/quotations/table";
import { CreateQuotation } from "@/app/ui/quotations/buttons";
import { fetchCurrencies } from "@/app/lib/currencies/data";
import { fetchFilteredQuotations } from "@/app/lib/quotations/data";
import { fetchPorts } from "@/app/lib/ports/data";
import { fetchCtnrs } from "@/app/lib/ctnrs/data";
import { fetchIncoterms } from "@/app/lib/incoterms/data";

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
    const query = searchParams?.query?.toLowerCase() || "";

    const [quotations, currencies, ports, ctnrs, incoterms] = await Promise.all([
        fetchFilteredQuotations(query),
        fetchCurrencies(),
        fetchPorts(),
        fetchCtnrs(),
        fetchIncoterms(),
    ]);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>견적서</h1>
            </div>
            <div className="my-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="견적서 검색..." />
                <CreateQuotation />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <QuotationsTable quotations={quotations} currencies={currencies} ports={ports} ctnrs={ctnrs} incoterms={incoterms} />
            </Suspense>
        </div>
    );
}
