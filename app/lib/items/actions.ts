"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";
import { Item } from "@prisma/client";

const FormSchema = z.object({
    id: z.string(),
    code: z.string().min(1, "코드를 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
    unitType: z.string(),
    vat: z.coerce.boolean(),
});

const CreateItem = FormSchema.omit({ id: true, date: true });
const UpdateItem = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
    errors?: {
        code?: string[];
        name?: string[];
        unitType?: string[];
        vat?: string[];
    };
    message?: string | null;
};

export async function createItem(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateItem.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        unitType: formData.get("unit_type"),
        vat: formData.get("vat"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Item.",
        };
    }

    // Prepare data for insertion into the database
    const { code, name, unitType, vat } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.item.create({
            data: {
                code: code,
                name: name,
                unitType: unitType,
                vat: vat,
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

export async function updateItemWithObject(item: Item | undefined, prevState: State, formData: FormData) {
    if (item === undefined) {
        throw new Error("항목 업데이트 실패: Object를 찾을 수 없음");
    }

    const validatedFields = UpdateItem.safeParse({
        code: item.code,
        name: item.name,
        unitType: item.unitType,
        vat: item.vat,
    });

    if (!validatedFields.success) {
        throw new Error(`항목 업데이트 실패: ${validatedFields.error.errors[0].message}`);
    }

    const { code, name, unitType, vat } = validatedFields.data;
    // Update the database record using Prisma
    try {
        await prisma.item.update({
            where: { id: item.id },
            data: {
                code: code,
                name: name,
                unitType: unitType,
                vat: vat,
            },
        });
    } catch (error) {
        throw new Error("항목 업데이트 실패: 데이터베이스 오류");
    }

    revalidatePath("/dashboard/items");
    redirect("/dashboard/items");
}

export async function updateItem(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateItem.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        unitType: formData.get("unit_type"),
        vat: formData.get("vat"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Item.",
        };
    }

    const { code, name, unitType, vat } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.item.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
                unitType: unitType,
                vat: vat,
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
        revalidatePath("/dashboard/items");
        return { message: "Deleted Item" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Item." };
    }
}
