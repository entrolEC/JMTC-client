import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import { fetchQuotationById } from "@/app/lib/quotations/data";
import QuotationEditForm from "@/app/ui/quotations/edit-form";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const quotation = await fetchQuotationById(id);

    if (!quotation) {
        notFound();
    }
    return (
        <Modal>
            <QuotationEditForm quotation={quotation} />
        </Modal>
    );
}
