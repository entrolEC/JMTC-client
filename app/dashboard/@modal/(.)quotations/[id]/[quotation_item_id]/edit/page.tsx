import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import { fetchQuotationById, fetchQuotationItemById } from "@/app/lib/quotations/data";
import QuotationItemEditForm from "@/app/ui/quotations/items/edit-form";

import { fetchCurrencies } from "@/app/lib/currencies/data";

export default async function Page({ params }: { params: { id: string; quotation_item_id: string } }) {
    const { id, quotation_item_id } = params;
    const [quotationItem, currencies, quotation] = await Promise.all([
        fetchQuotationItemById(quotation_item_id),
        fetchCurrencies(),
        fetchQuotationById(id),
    ]);

    if (!quotationItem || !quotation) {
        notFound();
    }

    return (
        <Modal>
            <QuotationItemEditForm quotation={quotation} quotationItem={quotationItem} currencies={currencies} />
        </Modal>
    );
}
