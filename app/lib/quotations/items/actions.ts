"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";

const FormSchema = z.object({
    id: z.string(),
    code: z.string().min(1, "Please type a code"),
    name: z.string().min(1, "Please type a name"),
});

const CreateQuotationItem = FormSchema.omit({ id: true });
const UpdateQuotationItem = FormSchema.omit({ id: true });

// This is temporary
export type State = {
    errors?: {
        code?: string[];
        name?: string[];
    };
    message?: string | null;
};

export async function createQuotationItem(quotationId: string, prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateQuotationItem.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Item.",
        };
    }

    // Prepare data for insertion into the database
    const { code, name } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.quoteItem.create({
            data: {
                code: code,
                name: name,
                quote_id: quotationId,
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

export async function updateQuotationItem(quotationId: string, id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateQuotationItem.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update QuoteItem.",
        };
    }

    const { code, name } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.quoteItem.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
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
        redirect(`/dashboard/quotations/${quotationId}`);
        return { message: "Deleted QuoteItem" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete QuoteItem" };
    }
}