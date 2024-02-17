import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

export async function fetchCtnrs() {
    try {
        const fetchFilteredCtnrs = await prisma.ctnr.findMany();

        return fetchFilteredCtnrs;
    } catch (error) {
        console.error("Failed to fetch ctnrs:", error);
        throw new Error("Failed to fetch ctnrs.");
    }
}

export async function fetchFilteredCtnrs(query: string) {
    try {
        const fetchFilteredCtnrs = await prisma.ctnr.findMany({
            where: {
                code: {
                    contains: query,
                    mode: "insensitive", // ILIKE equivalent in Prisma
                },
            },
        });

        return fetchFilteredCtnrs;
    } catch (error) {
        console.error("Failed to fetch ctnrs:", error);
        throw new Error("Failed to fetch ctnrs.");
    }
}

export async function fetchCtnrById(id: string) {
    noStore();
    try {
        const ctnrs = await prisma.ctnr.findUnique({
            where: { id: id },
        });

        return ctnrs;
    } catch (error) {
        console.error("Failed to fetch ctnrs:", error);
        throw new Error("Failed to fetch ctnrs.");
    }
}

export async function fetchCtnrsCode() {
    noStore();
    try {
        const ctnrs = await prisma.ctnr.findMany({
            select: {
                name: true,
            },
        });

        const codes = ctnrs.map((ctnr) => ctnr.name);

        return codes;
    } catch (error) {
        console.error("Failed to fetch ctnrs:", error);
        throw new Error("Failed to fetch ctnrs code.");
    }
}
