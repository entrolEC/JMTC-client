import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchItemById } from "@/app/lib/items/data";
import ItemEditForm from "@/app/ui/items/edit-form";

export const metadata: Metadata = {
    title: "Edit Item",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [item] = await Promise.all([fetchItemById(id)]);

    if (!item) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Items", href: "/dashboard/items" },
                    {
                        label: "Edit Item",
                        href: `/dashboard/items/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <ItemEditForm item={item} />
        </main>
    );
}
