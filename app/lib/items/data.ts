import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";
import { InvoiceForm } from "@/app/lib/definitions";

export async function fetchFilteredItems(query: string) {
    try {
        const fetchFilteredItems = await prisma.item.findMany({
            where: {
                code: {
                    contains: query,
                    mode: "insensitive", // ILIKE equivalent in Prisma
                },
            },
        });

        return fetchFilteredItems;
    } catch (error) {
        console.error("Failed to fetch items:", error);
        throw new Error("Failed to fetch items.");
    }
}

export async function fetchInvoiceById(id: string) {
    noStore();
    try {
        const invoice = (await prisma.invoice.findUnique({
            where: { id: id },
            select: {
                id: true,
                customer_id: true,
                amount: true,
                status: true,
            },
        })) as InvoiceForm;

        if (invoice) {
            // Convert amount from cents to dollars
            invoice.amount = invoice.amount / 100;
        }

        return invoice;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch invoice.");
    }
}

export async function fetchItemById(id: string) {
    noStore();
    try {
        const item = await prisma.item.findUnique({
            where: { id: id },
        });

        return item;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch item.");
    }
}

export async function fetchItemsCode() {
    noStore();
    try {
        const items = await prisma.item.findMany({
            select: {
                name: true,
            },
        });

        const codes = items.map((item) => item.name);

        return codes;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch items code.");
    }
}
