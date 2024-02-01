import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

export async function fetchItems() {
    try {
        const fetchFilteredItems = await prisma.item.findMany();

        return fetchFilteredItems;
    } catch (error) {
        console.error("Failed to fetch items:", error);
        throw new Error("Failed to fetch items.");
    }
}

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
