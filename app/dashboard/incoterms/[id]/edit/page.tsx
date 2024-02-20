import { notFound } from "next/navigation";
import { Metadata } from "next";
import IncotermEditForm from "@/app/ui/incoterms/edit-form";
import { fetchIncotermById } from "@/app/lib/incoterms/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export const metadata: Metadata = {
    title: "Edit Incoterm",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [incoterm] = await Promise.all([fetchIncotermById(id)]);

    if (!incoterm) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Incoterms", href: "/dashboard/incoterms" },
                    {
                        label: "Edit Incoterm",
                        href: `/dashboard/incoterms/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <IncotermEditForm incoterm={incoterm} />
        </main>
    );
}
