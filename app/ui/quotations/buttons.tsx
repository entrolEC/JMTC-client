import { DocumentMagnifyingGlassIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteQuotation } from "@/app/lib/quotations/actions";

export function CreateQuotation() {
    return (
        <Link
            href="/dashboard/quotations/create"
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <span className="hidden md:block">견적서 생성</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function QuotationDetail({ id }: { id: string }) {
    return (
        <Link href={`/dashboard/quotations/${id}`} className="rounded-md border p-2 hover:bg-gray-100">
            <DocumentMagnifyingGlassIcon className="w-5" />
        </Link>
    );
}

export function UpdateQuotation({ id }: { id: string }) {
    return (
        <Link href={`/dashboard/quotations/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteQuotation({ id }: { id: string }) {
    const deleteQuotationWithId = deleteQuotation.bind(null, id);

    return (
        <form action={deleteQuotationWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
