import { formatCurrency } from "./utils";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prismaClient";

export async function fetchRevenue() {
    // Add noStore() here to prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
    noStore();
    try {
        const revenues = await prisma.revenue.findMany();
        return revenues;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch revenue data.");
    }
}

export async function fetchLatestInvoices() {
    noStore();
    try {
        const latestInvoicesData = await prisma.invoice.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
            select: {
                amount: true,
                customer: {
                    select: {
                        name: true,
                        image_url: true,
                        email: true,
                    },
                },
                id: true,
            },
        });

        const latestInvoices = latestInvoicesData.map((invoice) => ({
            ...invoice,
            ...invoice.customer, // Spread customer fields at the same level as invoice fields
            amount: formatCurrency(invoice.amount),
        }));

        return latestInvoices;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch the latest invoices.");
    }
}

export async function fetchCardData() {
    noStore();
    try {
        const numberOfInvoices = await prisma.invoice.count();
        const numberOfCustomers = await prisma.customer.count();
        const totalPaid = await prisma.invoice.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: "paid",
            },
        });
        const totalPending = await prisma.invoice.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: "pending",
            },
        });

        return {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices: formatCurrency(totalPaid._sum?.amount ?? 0),
            totalPendingInvoices: formatCurrency(totalPending._sum?.amount ?? 0),
        };
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}
