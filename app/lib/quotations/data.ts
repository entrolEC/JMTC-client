import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

export async function fetchQuotationById(id: string) {
    noStore();
    try {
        const quotation = await prisma.quote.findUnique({
            where: { id: id },
            include: {
                ctnr: true,
            },
        });

        return quotation;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch quotation.");
    }
}

export async function fetchQuotationItemById(id: string) {
    noStore();
    try {
        const quotationItem = await prisma.quoteItem.findUnique({
            where: { id: id },
        });

        return quotationItem;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch quotation item.");
    }
}

export async function fetchFilteredQuotationItems(id: string, query: string) {
    try {
        const quoteWithFilteredQuoteItems = await prisma.quote
            .findUnique({
                where: {
                    id: id,
                },
                include: {
                    QuoteItem: true,
                },
            })
            .then((quote) => {
                if (!quote) return null;
                const filteredQuoteItems = quote.QuoteItem.filter((qi) => qi.code.includes(query) || qi.name.includes(query));

                if (!filteredQuoteItems) return [];

                return filteredQuoteItems;
            });

        if (!quoteWithFilteredQuoteItems) return [];

        return quoteWithFilteredQuoteItems;
    } catch (error) {
        console.error("Failed to fetch quotation items:", error);
        throw new Error("Failed to fetch quotation items");
    }
}

export async function fetchFilteredQuotations(query: string) {
    try {
        const fetchFilteredQuotations = await prisma.quote.findMany({
            where: {
                OR: [
                    {
                        writer: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        manager: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include: {
                ctnr: true,
            },
        });

        return fetchFilteredQuotations;
    } catch (error) {
        console.error("Failed to fetch quotations:", error);
        throw new Error("Failed to fetch quotations.");
    }
}
