import Modal from "@/app/ui/modal";
import QuotationItemCreateForm from "@/app/ui/quotations/items/create-form";
import { fetchItems } from "@/app/lib/items/data";
import { fetchQuotationById } from "@/app/lib/quotations/data";
import { notFound } from "next/navigation";
import { fetchCurrencies } from "@/app/lib/currencies/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [items, quotation, currencies] = await Promise.all([fetchItems(), fetchQuotationById(id), fetchCurrencies()]);

    if (!quotation) {
        notFound();
    }

    return (
        <Modal>
            <QuotationItemCreateForm quotation={quotation} items={items} currencies={currencies} />
        </Modal>
    );
}
