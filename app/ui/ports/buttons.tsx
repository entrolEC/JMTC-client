import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deletePort } from "@/app/lib/ports/actions";

export function CreatePort() {
    return (
        <Link
            href="/dashboard/ports/create"
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <span className="hidden md:block">Create Port</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function UpdatePort({ id }: { id: string }) {
    return (
        <Link href={`/dashboard/ports/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeletePort(props: any) {
    const handleClick = () => {
        const id = props.data.id;
        deletePort(id);
    };

    return (
        <button onClick={handleClick} className="rounded-md border p-2 hover:bg-gray-100">
            <TrashIcon className="w-5" />
        </button>
    );
}
