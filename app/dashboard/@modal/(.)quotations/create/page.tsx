import Modal from "@/app/ui/modal";
import QuotationCreateForm from "@/app/ui/quotations/create-form";
import { fetchCurrencies } from "@/app/lib/data";

export default async function Page() {
    const currencies = await fetchCurrencies();

    return (
        <Modal>
            <QuotationCreateForm currencies={currencies} />
        </Modal>
    );
}
