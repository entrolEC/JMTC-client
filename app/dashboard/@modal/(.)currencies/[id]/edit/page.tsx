import Modal from "@/app/ui/modal";
import { notFound } from "next/navigation";
import { fetchCurrencyById } from "@/app/lib/currencies/data";
import CurrencyEditForm from "@/app/ui/currencies/edit-form";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const currency = await fetchCurrencyById(id);

    if (!currency) {
        notFound();
    }
    return (
        <Modal>
            <CurrencyEditForm currency={currency} />
        </Modal>
    );
}
