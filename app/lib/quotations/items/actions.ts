"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";
import { Quote } from "@prisma/client";

const FormSchema = z.object({
    id: z.string(),
    code: z.string().min(1, "Please type a code"),
    name: z.string().min(1, "Please type a name"),
    unitType: z.string().min(1, "Please select a unitType"),
    value: z.coerce.number().gt(0, "최소 0보다 큰 값을 입력해야 합니다."),
    currency: z.string(),
    price: z.coerce.number(),
});

const CreateQuotationItem = FormSchema.omit({ id: true });
const UpdateQuotationItem = FormSchema.omit({ id: true });

// This is temporary
export type State = {
    errors?: {
        code?: string[];
        name?: string[];
        unitType?: string[];
        value?: string[];
        currency?: string[];
        price?: string[];
    };
    message?: string | null;
};

export async function createQuotationItem(quotation: Quote, _currency: string | undefined, isVat: boolean, prevState: State, formData: FormData) {
    const { id: quotationId, exchangeRate } = quotation;
    // Validate form fields using Zod
    const validatedFields = CreateQuotationItem.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        unitType: formData.get("unit_type"),
        value: formData.get("value"),
        currency: _currency,
        price: formData.get("price"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Item.",
        };
    }

    // Prepare data for insertion into the database
    const { code, name, unitType, value, currency, price } = validatedFields.data;

    let amount = value * price;
    if (currency !== "KRW") {
        amount *= exchangeRate;
    }

    const vatRate = 0.1;
    let vat = 0;
    if (isVat) {
        vat = Math.round(amount * vatRate * 100) / 100;
    }

    // Insert data into the database using Prisma
    try {
        await prisma.quoteItem.create({
            data: {
                code: code,
                name: name,
                quote_id: quotationId,
                unitType: unitType,
                value: value,
                currency: currency,
                price: price,
                amount: amount,
                vat: vat,
            },
        });
    } catch (error: any) {
        return {
            message: "데이터베이스 오류.",
        };
    }

    revalidatePath(`/dashboard/quotations/${quotationId}`);
    redirect(`/dashboard/quotations/${quotationId}`);
}

export async function updateQuotationItem(
    quotation: Quote,
    id: string,
    _currency: string | undefined,
    isVat: boolean,
    prevState: State,
    formData: FormData,
) {
    const { id: quotationId, exchangeRate } = quotation;

    const validatedFields = UpdateQuotationItem.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        unitType: formData.get("unit_type"),
        value: formData.get("value"),
        currency: _currency,
        price: formData.get("price"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update QuoteItem.",
        };
    }

    const { code, name, unitType, value, currency, price } = validatedFields.data;

    let amount = value * price;
    if (currency !== "KRW") {
        amount *= exchangeRate;
    }
    const vatRate = 0.1;
    let vat = 0;
    if (isVat) {
        vat = Math.round(amount * vatRate * 100) / 100;
    }

    // Update the database record using Prisma
    try {
        await prisma.quoteItem.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
                quote_id: quotationId,
                unitType: unitType,
                value: value,
                currency: currency,
                price: price,
                amount: amount,
                vat: vat,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update QuoteItem." };
    }

    revalidatePath(`/dashboard/quotations/${quotationId}`);
    redirect(`/dashboard/quotations/${quotationId}`);
}

export async function deleteQuotationItem(quotationId: string, id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await prisma.quoteItem.delete({
            where: { id: id },
        });
        revalidatePath(`/dashboard/quotations/${quotationId}`);
        return { message: "Deleted QuoteItem" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete QuoteItem" };
    }
}
