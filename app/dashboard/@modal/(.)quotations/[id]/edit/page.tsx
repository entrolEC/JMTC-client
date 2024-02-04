import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import { fetchQuotationById } from "@/app/lib/quotations/data";
import QuotationEditForm from "@/app/ui/quotations/edit-form";
import { fetchCurrencies } from "@/app/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [quotation, currencies] = await Promise.all([fetchQuotationById(id), fetchCurrencies()]);

    if (!quotation) {
        notFound();
    }
    return (
        <Modal>
            <QuotationEditForm quotation={quotation} currencies={currencies} />
        </Modal>
    );
}
