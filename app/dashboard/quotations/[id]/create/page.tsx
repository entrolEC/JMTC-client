import Link from "next/link";
import QuotationItemCreateForm from "@/app/ui/quotations/items/create-form";
import { fetchItems } from "@/app/lib/items/data";
import { fetchQuotationById } from "@/app/lib/quotations/data";
import { notFound } from "next/navigation";
import { fetchCurrencies } from "@/app/lib/currencies/data";

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { position?: string } }) {
    const { id } = params;
    const position = Number(searchParams?.position) || 99999;
    const [items, quotation, currencies] = await Promise.all([fetchItems(), fetchQuotationById(id), fetchCurrencies()]);

    if (!quotation) {
        notFound();
    }
    return (
        <div className="container mx-auto space-y-2">
            <h1 className="font-bold text-4xl p-4 ml-8">견적서 항목 생성</h1>
            <QuotationItemCreateForm quotation={quotation} items={items} currencies={currencies} position={position} />
            <Link
                href={`/dashboard/quotations/${id}`}
                className="flex w-20 h-10 items-center rounded-lg px-4 text-sm font-medium text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
                취소
            </Link>
        </div>
    );
}
