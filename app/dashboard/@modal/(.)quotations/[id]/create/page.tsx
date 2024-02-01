import Modal from "@/app/ui/modal";
import QuotationItemCreateForm from "@/app/ui/quotations/items/create-form";
import { fetchItems } from "@/app/lib/items/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const items = await fetchItems();

    return (
        <Modal>
            <QuotationItemCreateForm quotationId={id} items={items} />
        </Modal>
    );
}
