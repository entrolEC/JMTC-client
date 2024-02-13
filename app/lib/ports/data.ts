import prisma from "@/app/lib/prismaClient";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

export async function fetchPorts() {
    try {
        const fetchFilteredPorts = await prisma.port.findMany();

        return fetchFilteredPorts;
    } catch (error) {
        console.error("Failed to fetch ports:", error);
        throw new Error("Failed to fetch ports.");
    }
}

export async function fetchFilteredPorts(query: string) {
    try {
        const fetchFilteredPorts = await prisma.port.findMany({
            where: {
                code: {
                    contains: query,
                    mode: "insensitive", // ILIKE equivalent in Prisma
                },
            },
        });

        return fetchFilteredPorts;
    } catch (error) {
        console.error("Failed to fetch ports:", error);
        throw new Error("Failed to fetch ports.");
    }
}

export async function fetchPortById(id: string) {
    noStore();
    try {
        const ports = await prisma.port.findUnique({
            where: { id: id },
        });

        return ports;
    } catch (error) {
        console.error("Failed to fetch ports:", error);
        throw new Error("Failed to fetch ports.");
    }
}

export async function fetchPortsCode() {
    noStore();
    try {
        const ports = await prisma.port.findMany({
            select: {
                name: true,
            },
        });

        const codes = ports.map((port) => port.name);

        return codes;
    } catch (error) {
        console.error("Failed to fetch ports:", error);
        throw new Error("Failed to fetch ports code.");
    }
}
