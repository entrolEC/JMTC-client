import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteQuotationItem } from "@/app/lib/quotations/items/actions";

export function CreateQuotationItem({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/quotations/${id}/create`}
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <span className="hidden md:block">견적 항목 생성</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function UpdateQuotationItem({ quotationId, id }: { quotationId: string; id: string }) {
    return (
        <Link href={`/dashboard/quotations/${quotationId}/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteQuotationItem({ quotationId, id }: { quotationId: string; id: string }) {
    const deleteQuotationItemWithId = deleteQuotationItem.bind(null, quotationId, id);

    return (
        <form action={deleteQuotationItemWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">삭제</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
