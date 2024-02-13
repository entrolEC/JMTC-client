import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import PortEditForm from "@/app/ui/ports/edit-form";
import { fetchPortById } from "@/app/lib/ports/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const port = await fetchPortById(id);

    if (!port) {
        notFound();
    }
    return (
        <Modal>
            <PortEditForm port={port} />
        </Modal>
    );
}
