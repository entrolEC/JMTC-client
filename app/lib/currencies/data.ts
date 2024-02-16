import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

export async function fetchCurrencies() {
    try {
        const fetchFilteredPorts = await prisma.currency.findMany();

        return fetchFilteredCurrencies;
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        throw new Error("Failed to fetch currencies.");
    }
}

export async function fetchFilteredCurrencies(query: string) {
    try {
        const fetchFilteredCurrencies = await prisma.currency.findMany({
            where: {
                OR: [
                    {
                        code: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });

        return fetchFilteredCurrencies;
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        throw new Error("Failed to fetch currencies.");
    }
}

export async function fetchCurrencyById(id: string) {
    noStore();
    try {
        const currencies = await prisma.currency.findUnique({
            where: { id: id },
        });

        return currencies;
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        throw new Error("Failed to fetch currencies.");
    }
}

export async function fetchCurrenciesCode() {
    noStore();
    try {
        const currencies = await prisma.currency.findMany({
            select: {
                name: true,
            },
        });

        const codes = currencies.map((currency) => currency.name);

        return codes;
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        throw new Error("Failed to fetch currencies code.");
    }
}
