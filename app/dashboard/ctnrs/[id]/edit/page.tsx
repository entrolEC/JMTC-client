import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CtnrEditForm from "@/app/ui/ctnrs/edit-form";
import { fetchCtnrById } from "@/app/lib/ctnrs/data";

export const metadata: Metadata = {
    title: "Edit Ctnr",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [ctnr] = await Promise.all([fetchCtnrById(id)]);

    if (!ctnr) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Ctnrs", href: "/dashboard/ctnrs" },
                    {
                        label: "Edit Ctnr",
                        href: `/dashboard/ctnrs/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <CtnrEditForm ctnr={ctnr} />
        </main>
    );
}
