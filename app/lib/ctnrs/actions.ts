"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";

const FormSchema = z.object({
    id: z.string(),
    code: z.string().min(1, "코드를 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
    containerMode: z.coerce.boolean(),
    description: z.nullable(z.string()),
});

const CreateCtnr = FormSchema.omit({ id: true, date: true });
const UpdateCtnr = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
    errors?: {
        code?: string[];
        name?: string[];
        containerMode?: string[];
        descrtion?: string[];
    };
    message?: string | null;
};

export async function createCtnr(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateCtnr.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        containerMode: formData.get("container_mode"),
        description: formData.get("description"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Item.",
        };
    }

    // Prepare data for insertion into the database
    const { code, name, containerMode, description } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.ctnr.create({
            data: {
                code: code,
                name: name,
                containerMode: containerMode,
                description: description,
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
    revalidatePath("/dashboard/ctnrs");
    redirect("/dashboard/ctnrs");
}

export async function updateCtnr(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateCtnr.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        containerMode: formData.get("container_mode"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Item.",
        };
    }

    const { code, name, containerMode, description } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.ctnr.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
                containerMode: containerMode,
                description: description,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update Item." };
    }

    revalidatePath("/dashboard/ctnrs");
    redirect("/dashboard/ctnrs");
}

export async function deleteCtnr(id: string) {
    try {
        await prisma.ctnr.delete({
            where: { id: id },
        });
        revalidatePath("/dashboard/ctnrs");
        return { message: "Deleted Ctnr" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Ctnr." };
    }
}
