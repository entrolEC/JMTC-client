import Modal from "@/app/ui/modal";
import ItemEditForm from "@/app/ui/items/edit-form";
import { fetchItemById } from "@/app/lib/items/data";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const item = await fetchItemById(id);

    if (!item) {
        notFound();
    }
    return (
        <Modal>
            <ItemEditForm item={item} />
        </Modal>
    );
}
