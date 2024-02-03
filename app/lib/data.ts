import { InvoiceForm, InvoicesTable } from "./definitions";
import { formatCurrency } from "./utils";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/prismaClient";
import { Prisma } from "@prisma/client";

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

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const invoices = await prisma.$queryRaw<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${Prisma.sql`${ITEMS_PER_PAGE}`} OFFSET ${Prisma.sql`${offset}`}
    `;

        return invoices;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch invoices.");
    }
}

export async function fetchInvoicesPages(query: string) {
    noStore();
    try {
        const count = await prisma.invoice.count({
            where: {
                OR: [
                    {
                        customer: {
                            name: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        customer: {
                            email: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                    // 다른 필드에 대한 조건 추가 가능
                ],
            },
        });

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of invoices.");
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

export async function fetchCustomers() {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return customers;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch all customers.");
    }
}

export async function fetchFilteredCustomers(query: string) {
    noStore();
    try {
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: "insensitive", // ILIKE equivalent in Prisma
                        },
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive", // ILIKE equivalent in Prisma
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                image_url: true,
                invoices: {
                    select: {
                        id: true,
                        status: true,
                        amount: true,
                    },
                },
            },
        });

        const formattedCustomers = customers.map((customer) => {
            const total_invoices = customer.invoices.length;
            const total_pending = customer.invoices.reduce((acc, invoice) => (invoice.status === "pending" ? acc + invoice.amount : acc), 0);
            const total_paid = customer.invoices.reduce((acc, invoice) => (invoice.status === "paid" ? acc + invoice.amount : acc), 0);

            return {
                ...customer,
                total_invoices,
                total_pending: formatCurrency(total_pending),
                total_paid: formatCurrency(total_paid),
            };
        });

        return formattedCustomers;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch customer table.");
    }
}

export async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
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
        });

        return fetchFilteredQuotations;
    } catch (error) {
        console.error("Failed to fetch quotations:", error);
        throw new Error("Failed to fetch quotations.");
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

export async function fetchCurrencies() {
    try {
        const currencies = await prisma.currency.findMany();

        return currencies;
    } catch (error) {
        console.error("Failed to fetch currencies", error);
        throw new Error("Failed to fetch currencies");
    }
}
