import { notFound } from "next/navigation";
import { Metadata } from "next";
import PortEditForm from "@/app/ui/ports/edit-form";
import { fetchPortById } from "@/app/lib/ports/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export const metadata: Metadata = {
    title: "Edit Ports",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [port] = await Promise.all([fetchPortById(id)]);

    if (!port) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Ports", href: "/dashboard/ports" },
                    {
                        label: "Edit Port",
                        href: `/dashboard/ports/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <PortEditForm port={port} />
        </main>
    );
}
