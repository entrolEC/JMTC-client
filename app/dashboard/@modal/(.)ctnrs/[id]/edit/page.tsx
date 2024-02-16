import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import CtnrEditForm from "@/app/ui/ctnrs/edit-form";
import { fetchCtnrById } from "@/app/lib/ctnrs/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const ctnr = await fetchCtnrById(id);

    if (!ctnr) {
        notFound();
    }
    return (
        <Modal>
            <CtnrEditForm ctnr={ctnr} />
        </Modal>
    );
}
