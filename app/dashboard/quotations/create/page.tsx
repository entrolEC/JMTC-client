import Link from "next/link";
import QuotationCreateForm from "@/app/ui/quotations/create-form";
import { fetchPorts } from "@/app/lib/ports/data";
import { fetchCtnrs } from "@/app/lib/ctnrs/data";
import { fetchIncoterms } from "@/app/lib/incoterms/data";
import { fetchCurrencies } from "@/app/lib/currencies/data";

export default async function Page() {
    const [ports, ctnrs, incoterms, currencies] = await Promise.all([fetchPorts(), fetchCtnrs(), fetchIncoterms(), fetchCurrencies()]);

    return (
        <div className="container mx-auto space-y-2">
            <h1 className="font-bold text-4xl p-4 ml-8">견적서 생성</h1>
            <QuotationCreateForm ports={ports} ctnrs={ctnrs} incoterms={incoterms} currencies={currencies} />
            <Link
                href="/dashboard/quotations"
                className="flex w-20 h-10 items-center rounded-lg px-4 text-sm font-medium text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
                Cancel
            </Link>
        </div>
    );
}
