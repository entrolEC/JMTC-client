import Link from "next/link";
import CurrencyCreateForm from "@/app/ui/currencies/create-form";

export default function Page() {
    return (
        <div className="container mx-auto space-y-2">
            <h1 className="font-bold text-4xl p-4 ml-8">통화 생성</h1>
            <CurrencyCreateForm />
            <Link
                href="/dashboard/currencies"
                className="flex w-20 h-10 items-center rounded-lg px-4 text-sm font-medium text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
                Cancel
            </Link>
        </div>
    );
}
