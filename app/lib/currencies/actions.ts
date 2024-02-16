"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";

const FormSchema = z.object({
    id: z.string(),
    code: z.string().min(1, "코드를 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
});

const CreateCurrency = FormSchema.omit({ id: true, date: true });
const UpdateCurrency = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
    errors?: {
        code?: string[];
        name?: string[];
    };
    message?: string | null;
};

export async function createCurrency(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateCurrency.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Currency.",
        };
    }

    // Prepare data for insertion into the database
    const { code, name } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.currency.create({
            data: {
                code: code,
                name: name,
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
    revalidatePath("/dashboard/currencies");
    redirect("/dashboard/currencies");
}

export async function updateCurrency(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateCurrency.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Currency.",
        };
    }

    const { code, name } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.currency.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update Currency." };
    }

    revalidatePath("/dashboard/currencies");
    redirect("/dashboard/currencies");
}

export async function deleteCurrency(id: string) {
    try {
        await prisma.currency.delete({
            where: { id: id },
        });
        revalidatePath("/dashboard/currencies");
        return { message: "Deleted Currency" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Currency." };
    }
}
