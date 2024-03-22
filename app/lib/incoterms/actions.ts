"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";
import { Incoterm } from ".prisma/client";

const FormSchema = z.object({
    id: z.string(),
    code: z.string().min(1, "코드를 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
    description: z.nullable(z.string()),
});

const CreateIncoterm = FormSchema.omit({ id: true, date: true });
const UpdateIncoterm = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
    errors?: {
        code?: string[];
        name?: string[];
        descrtion?: string[];
    };
    message?: string | null;
};

export async function createIncoterm(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateIncoterm.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
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
    const { code, name, description } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.incoterm.create({
            data: {
                code: code,
                name: name,
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
    revalidatePath("/dashboard/incoterms");
    redirect("/dashboard/incoterms");
}

export async function updateIncotermWithObject(incoterm: Incoterm | undefined, prevState: State, formData: FormData) {
    if (incoterm === undefined) {
        throw new Error("항목 업데이트 실패: Object를 찾을 수 없음");
    }

    const validatedFields = UpdateIncoterm.safeParse({
        code: incoterm.code,
        name: incoterm.name,
        description: incoterm.description,
    });

    if (!validatedFields.success) {
        throw new Error(`항목 업데이트 실패: ${validatedFields.error.errors[0].message}`);
    }

    const { code, name, description } = validatedFields.data;
    // Update the database record using Prisma
    try {
        await prisma.incoterm.update({
            where: { id: incoterm.id },
            data: {
                code: code,
                name: name,
                description: description,
            },
        });
    } catch (error) {
        throw new Error("항목 업데이트 실패: 데이터베이스 오류");
    }

    revalidatePath("/dashboard/incoterms");
    redirect("/dashboard/incoterms");
}

export async function updateIncoterm(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateIncoterm.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Item.",
        };
    }

    const { code, name, description } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.incoterm.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
                description: description,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update Item." };
    }

    revalidatePath("/dashboard/incoterms");
    redirect("/dashboard/incoterms");
}

export async function deleteIncoterm(id: string) {
    try {
        await prisma.incoterm.delete({
            where: { id: id },
        });
        revalidatePath("/dashboard/incoterms");
        return { message: "Deleted Incoterm" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Incoterm." };
    }
}
