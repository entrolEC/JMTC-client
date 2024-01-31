import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

export async function fetchQuotationById(id: string) {
    noStore();
    try {
        const quotation = await prisma.quote.findUnique({
            where: { id: id },
        });

        return quotation;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch quotation.");
    }
}
