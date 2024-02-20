import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchQuotationById, fetchQuotationItemById } from "@/app/lib/quotations/data";
import QuotationItemEditForm from "@/app/ui/quotations/items/edit-form";
import { fetchCurrencies } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export const metadata: Metadata = {
    title: "Edit Item",
};

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
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "견적서 항목", href: `/dashboard/quotations/${id}` },
                    {
                        label: "견적서 항목 수정",
                        href: `/dashboard/quotations/${id}/${quotation_item_id}/edit`,
                        active: true,
                    },
                ]}
            />
            <QuotationItemEditForm quotation={quotation} quotationItem={quotationItem} currencies={currencies} />
        </main>
    );
}
