import Modal from "@/app/ui/modal";
import QuotationCreateForm from "@/app/ui/quotations/create-form";
import { fetchPorts } from "@/app/lib/ports/data";
import { fetchCtnrs } from "@/app/lib/ctnrs/data";
import { fetchIncoterms } from "@/app/lib/incoterms/data";
import { fetchCurrencies } from "@/app/lib/currencies/data";

export default async function Page() {
    const [ports, ctnrs, incoterms, currencies] = await Promise.all([fetchPorts(), fetchCtnrs(), fetchIncoterms(), fetchCurrencies()]);

    return (
        <Modal>
            <QuotationCreateForm ports={ports} ctnrs={ctnrs} incoterms={incoterms} currencies={currencies} />
        </Modal>
    );
}
