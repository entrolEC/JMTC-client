import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteCtnr } from "@/app/lib/ctnrs/actions";

export function CreateCtnr() {
    return (
        <Link
            href="/dashboard/ctnrs/create"
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <span className="hidden md:block">Create Ctnr</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function Updatectnr({ id }: { id: string }) {
    return (
        <Link href={`/dashboard/ctnrs/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteCtnr({ id }: { id: string }) {
    const deleteCtnrWithId = deleteCtnr.bind(null, id);

    return (
        <form action={deleteCtnrWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
