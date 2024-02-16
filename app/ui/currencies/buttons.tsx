import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteCurrency } from "@/app/lib/currencies/actions";

export function CreateCurrency() {
    return (
        <Link
            href="/dashboard/currencies/create"
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <span className="hidden md:block">Create Currency</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function UpdateCurrency({ id }: { id: string }) {
    return (
        <Link href={`/dashboard/currencies/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteCurrency({ id }: { id: string }) {
    const deleteCurrencyWithId = deleteCurrency.bind(null, id);

    return (
        <form action={deleteCurrencyWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
