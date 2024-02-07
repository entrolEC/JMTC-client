import Link from "next/link";
import QuotationCreateForm from "@/app/ui/quotations/create-form";
import { fetchCurrencies } from "@/app/lib/data";

export default async function Page() {
    const currencies = await fetchCurrencies();
    return (
        <div className="container mx-auto space-y-2">
            <h1 className="font-bold text-4xl p-4 ml-8">견적서 생성</h1>
            <QuotationCreateForm currencies={currencies} />
            <Link
                href="/dashboard/quotations"
                className="flex w-20 h-10 items-center rounded-lg px-4 text-sm font-medium text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
                Cancel
            </Link>
        </div>
    );
}
