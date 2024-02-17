import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchQuotationById } from "@/app/lib/quotations/data";
import QuotationEditForm from "@/app/ui/quotations/edit-form";
import { fetchCurrencies } from "@/app/lib/data";
import { fetchPorts } from "@/app/lib/ports/data";
import { fetchCtnrs } from "@/app/lib/ctnrs/data";
import { fetchIncoterms } from "@/app/lib/incoterms/data";

export const metadata: Metadata = {
    title: "Edit Item",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
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
            <QuotationEditForm quotation={quotation} ports={ports} ctnrs={ctnrs} incoterms={incoterms} currencies={currencies} />
        </main>
    );
}
