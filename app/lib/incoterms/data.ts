import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

export async function fetchIncoterms() {
    try {
        const fetchFilteredPorts = await prisma.incoterm.findMany();

        return fetchFilteredIncoterms;
    } catch (error) {
        console.error("Failed to fetch incoterms:", error);
        throw new Error("Failed to fetch incoterms.");
    }
}

export async function fetchFilteredIncoterms(query: string) {
    try {
        const fetchFilteredIncoterms = await prisma.incoterm.findMany({
            where: {
                code: {
                    contains: query,
                    mode: "insensitive", // ILIKE equivalent in Prisma
                },
            },
        });

        return fetchFilteredIncoterms;
    } catch (error) {
        console.error("Failed to fetch incoterms:", error);
        throw new Error("Failed to fetch incoterms.");
    }
}

export async function fetchIncotermById(id: string) {
    noStore();
    try {
        const incoterms = await prisma.incoterm.findUnique({
            where: { id: id },
        });

        return incoterms;
    } catch (error) {
        console.error("Failed to fetch incoterms:", error);
        throw new Error("Failed to fetch incoterms.");
    }
}

export async function fetchIncotermsCode() {
    noStore();
    try {
        const incoterms = await prisma.incoterm.findMany({
            select: {
                name: true,
            },
        });

        const codes = incoterms.map((incoterm) => incoterm.name);

        return codes;
    } catch (error) {
        console.error("Failed to fetch incoterms:", error);
        throw new Error("Failed to fetch incoterms code.");
    }
}
