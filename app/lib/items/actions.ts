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

const CreateItem = FormSchema.omit({ id: true, date: true });
const UpdateItem = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
    errors?: {
        code?: string[];
        name?: string[];
    };
    message?: string | null;
};

export async function createItem(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateItem.safeParse({
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
        await prisma.item.create({
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
    revalidatePath("/dashboard/items");
    redirect("/dashboard/items");
}

export async function updateItem(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateItem.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Invoice.",
        };
    }

    const { code, name } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.item.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update Item." };
    }

    revalidatePath("/dashboard/items");
    redirect("/dashboard/items");
}

export async function deleteItem(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await prisma.item.delete({
            where: { id: id },
        });
        return { message: "Deleted Item" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Item." };
    }
}
