import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import { fetchQuotationById } from "@/app/lib/quotations/data";
import QuotationEditForm from "@/app/ui/quotations/edit-form";
import { fetchPorts } from "@/app/lib/ports/data";
import { fetchCtnrs } from "@/app/lib/ctnrs/data";
import { fetchIncoterms } from "@/app/lib/incoterms/data";
import { fetchCurrencies } from "@/app/lib/currencies/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [quotation, ports, ctnrs, incoterms, currencies] = await Promise.all([
        fetchQuotationById(id),
        fetchPorts(),
        fetchCtnrs(),
        fetchIncoterms(),
        fetchCurrencies(),
    ]);

    if (!quotation) {
        notFound();
    }
    return (
        <Modal>
            <QuotationEditForm quotation={quotation} ports={ports} ctnrs={ctnrs} incoterms={incoterms} currencies={currencies} />
        </Modal>
    );
}
