import { Metadata } from "next";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { CreateItem } from "@/app/ui/items/buttons";
import ItemsTable from "@/app/ui/items/table";
import { fetchFilteredItems } from "@/app/lib/items/data";

export const metadata: Metadata = {
    title: "item",
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

    const items = await fetchFilteredItems(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Items</h1>
            </div>
            <div className="my-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="아이템 검색..." />
                <CreateItem />
            </div>
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <ItemsTable items={items} />
            </Suspense>
        </div>
    );
}
