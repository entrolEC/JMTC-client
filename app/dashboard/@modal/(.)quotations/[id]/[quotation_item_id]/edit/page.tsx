import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import { fetchQuotationItemById } from "@/app/lib/quotations/data";
import QuotationItemEditForm from "@/app/ui/quotations/items/edit-form";

export default async function Page({ params }: { params: { id: string; quotation_item_id: string } }) {
    const { id, quotation_item_id } = params;
    const quotationItem = await fetchQuotationItemById(quotation_item_id);

    if (!quotationItem) {
        notFound();
    }

    return (
        <Modal>
            <QuotationItemEditForm quotationId={id} quotationItem={quotationItem} />
        </Modal>
    );
}
