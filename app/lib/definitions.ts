import { Quote } from "@prisma/client";
import { Ctnr } from ".prisma/client";

export type Revenue = {
    month: string;
    revenue: number;
};

export type InvoicesTable = {
    id: string;
    customer_id: string;
    name: string;
    email: string;
    image_url: string;
    date: string;
    amount: number;
    status: "pending" | "paid";
};

export type InvoiceForm = {
    id: string;
    customer_id: string;
    amount: number;
    status: "pending" | "paid";
};

export type QuoteWithCtnr = Quote & { ctnr: Ctnr };
