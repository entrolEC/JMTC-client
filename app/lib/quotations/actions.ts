"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";
import { auth, signOut } from "@/auth";

const FormSchema = z.object({
    id: z.string(),
    value: z.coerce.number().gt(0, "최소 0보다 큰 값을 입력해야 합니다."),
    manager: z.string().min(1, "Please type a manager"),
    writer: z.string(),
    currency: z.string(),
    exchangeRate: z.coerce.number(),
});

const CreateQuotation = FormSchema.omit({ id: true, date: true, writer: true });
const UpdateQuotation = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
    errors?: {
        value?: string[];
        manager?: string[];
        currency?: string[];
        exchangeRate?: string[];
    };
    message?: string | null;
};

export async function createQuotation(_currency: string | undefined, prevState: State, formData: FormData) {
    const session = await auth();
    // Validate form fields using Zod
    const validatedFields = CreateQuotation.safeParse({
        gWeight: formData.get("g_weight"),
        manager: formData.get("manager"),
        value: formData.get("value"),
        currency: _currency,
        exchangeRate: formData.get("exchange_rate"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Item.",
        };
    }

    if (!session?.user?.name) {
        signOut().then(() => redirect("/"));
        return {
            message: "세션 오류. 로그인을 다시 시도해주세요.",
        };
    }

    // Prepare data for insertion into the database
    const { manager, value, currency, exchangeRate } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.quote.create({
            data: {
                value: value,
                manager: manager,
                writer: session.user.name,
                currency: currency,
                exchangeRate: exchangeRate,
            },
        });
    } catch (error: any) {
        // If a database error occurs, return a more specific error.
        if (error.code === "P2002") {
            return {
                message: "중복된 코드가 존재합니다.",
            };
        }
        return {
            message: "데이터베이스 오류.",
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath("/dashboard/quotations");
    redirect("/dashboard/quotations");
}

export async function updateQuotation(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateQuotation.safeParse({
        value: formData.get("value"),
        manager: formData.get("manager"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Invoice.",
        };
    }

    const { value, manager } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.quote.update({
            where: { id: id },
            data: {
                value: value,
                manager: manager,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update Item." };
    }

    revalidatePath("/dashboard/quotations");
    redirect("/dashboard/quotations");
}

export async function deleteQuotation(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await prisma.quote.delete({
            where: { id: id },
        });
        revalidatePath("/dashboard/quotations");
        return { message: "Deleted Quotation" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Quotation." };
    }
}
