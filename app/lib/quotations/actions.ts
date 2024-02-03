"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";
import { auth, signOut } from "@/auth";

const FormSchema = z.object({
    id: z.string(),
    gWeight: z.coerce.number(),
    manager: z.string().min(1, "Please type a manager"),
    writer: z.string(),
    currency: z.string(),
});

const CreateQuotation = FormSchema.omit({ id: true, date: true, writer: true });
const UpdateQuotation = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
    errors?: {
        gWeight?: string[];
        manager?: string[];
        currency?: string[];
    };
    message?: string | null;
};

export async function createQuotation(_currency: string | undefined, prevState: State, formData: FormData) {
    const session = await auth();
    // Validate form fields using Zod
    const validatedFields = CreateQuotation.safeParse({
        gWeight: formData.get("g_weight"),
        manager: formData.get("manager"),
        currency: _currency,
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
    const { manager, gWeight, currency } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.quote.create({
            data: {
                gWeight: gWeight,
                manager: manager,
                writer: session.user.name,
                currency: currency,
                exchangeRate: 1,
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
        gWeight: formData.get("g_weight"),
        manager: formData.get("manager"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Invoice.",
        };
    }

    const { gWeight, manager } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.quote.update({
            where: { id: id },
            data: {
                gWeight: gWeight,
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
