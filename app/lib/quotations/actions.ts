"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prismaClient";
import { auth, signOut } from "@/auth";

const FormSchema = z.object({
    id: z.string(),
    mode: z.enum(["OCEAN", "AIR"]),
    value: z.coerce.number().gt(0, "최소 0보다 큰 값을 입력해야 합니다."),
    manager: z.string().min(1, "담당자를 입력해주세요"),
    grossWeight: z.nullable(z.coerce.number()),
    writer: z.string(),
    currency: z.string(),
    loadingPort: z.string(),
    dischargePort: z.string(),
    ctnr: z.string(),
    incoterm: z.string(),
    exchangeRate: z.coerce.number(),
});

const CreateQuotation = FormSchema.omit({ id: true, date: true, writer: true });
const UpdateQuotation = FormSchema.omit({ date: true, id: true, writer: true, mode: true });

// This is temporary
export type State = {
    errors?: {
        mode?: string[];
        value?: string[];
        manager?: string[];
        currency?: string[];
        exchangeRate?: string[];
        grossWeight?: string[];
        loadingPort?: string[];
        dischargePort?: string[];
        ctnr?: string[];
        incoterm?: string[];
    };
    message?: string | null;
};

export async function createQuotation(
    _currency: string | undefined,
    _loadingPort: string | undefined,
    _dischargePort: string | undefined,
    _ctnr: string | undefined,
    _incoterm: string | undefined,
    prevState: State,
    formData: FormData,
) {
    const session = await auth();
    // Validate form fields using Zod
    const validatedFields = CreateQuotation.safeParse({
        mode: formData.get("mode"),
        manager: formData.get("manager"),
        value: formData.get("value"),
        grossWeight: formData.get("grossWeight"),
        currency: _currency,
        loadingPort: _loadingPort,
        dischargePort: _dischargePort,
        ctnr: _ctnr,
        incoterm: _incoterm,
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
    const { mode, manager, value, grossWeight, currency, exchangeRate, dischargePort, loadingPort, incoterm, ctnr } = validatedFields.data;

    // Insert data into the database using Prisma
    try {
        await prisma.quote.create({
            data: {
                mode: mode,
                grossWeight: grossWeight,
                value: value,
                manager: manager,
                writer: session.user.name,
                currency: currency,
                ctnrId: ctnr,
                incotermId: incoterm,
                loadingPortId: loadingPort,
                dischargePortId: dischargePort,
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

export async function updateQuotation(id: string, _currency: string | undefined, prevState: State, formData: FormData) {
    const validatedFields = UpdateQuotation.safeParse({
        grossWeight: formData.get("grossWeight"),
        manager: formData.get("manager"),
        value: formData.get("value"),
        currency: _currency,
        exchangeRate: formData.get("exchange_rate"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Quotation.",
        };
    }

    const { value, manager, grossWeight, currency, exchangeRate } = validatedFields.data;

    // Update the database record using Prisma
    try {
        await prisma.quote.update({
            where: { id: id },
            data: {
                grossWeight: grossWeight,
                value: value,
                manager: manager,
                currency: currency,
                exchangeRate: exchangeRate,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update Quotation." };
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
