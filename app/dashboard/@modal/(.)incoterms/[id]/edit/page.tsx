import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import IncotermEditForm from "@/app/ui/incoterms/edit-form";
import { fetchIncotermById } from "@/app/lib/incoterms/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const incoterm = await fetchIncotermById(id);

    if (!incoterm) {
        notFound();
    }
    return (
        <Modal>
            <IncotermEditForm incoterm={incoterm} />
        </Modal>
    );
}
