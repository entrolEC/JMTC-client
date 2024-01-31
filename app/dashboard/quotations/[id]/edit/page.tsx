import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchQuotationById } from "@/app/lib/quotations/data";
import QuotationEditForm from "@/app/ui/quotations/edit-form";

export const metadata: Metadata = {
    title: "Edit Item",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [quotation] = await Promise.all([fetchQuotationById(id)]);

    if (!quotation) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Items", href: "/dashboard/quotations" },
                    {
                        label: "Edit Item",
                        href: `/dashboard/quotations/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <QuotationEditForm quotation={quotation} />
        </main>
    );
}
