import { notFound } from "next/navigation";
import { Metadata } from "next";
import CurrencyEditForm from "@/app/ui/currencies/edit-form";
import { fetchCurrencyById } from "@/app/lib/currencies/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export const metadata: Metadata = {
    title: "Edit Incoterm",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [currency] = await Promise.all([fetchCurrencyById(id)]);

    if (!currency) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Incoterms", href: "/dashboard/currencies" },
                    {
                        label: "Edit Incoterm",
                        href: `/dashboard/currencies/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <CurrencyEditForm currency={currency} />
        </main>
    );
}
