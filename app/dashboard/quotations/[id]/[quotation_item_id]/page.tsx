import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchQuotationItemById } from "@/app/lib/quotations/data";
import QuotationItemEditForm from "@/app/ui/quotations/items/edit-form";

export const metadata: Metadata = {
    title: "Edit Item",
};

export default async function Page({ params }: { params: { id: string; quotation_item_id: string } }) {
    const { id, quotation_item_id } = params;
    const [quotationItem] = await Promise.all([fetchQuotationItemById(id)]);

    if (!quotationItem) {
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
            <QuotationItemEditForm quotationId={id} quotationItem={quotationItem} />
        </main>
    );
}
