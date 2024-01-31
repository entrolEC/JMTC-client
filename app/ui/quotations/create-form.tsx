"use client";

import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";
import { createQuotation } from "@/app/lib/quotations/actions";

export default function QuotationCreateForm() {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createQuotation, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Invoice Amount */}
                <div className="mb-4">
                    <label htmlFor="code" className="mb-2 block text-sm font-medium">
                        g.weight
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <input
                            id="g_weight"
                            name="g_weight"
                            type="number"
                            step={0.01}
                            placeholder="g.weight를 입력해주세요."
                            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="code-error"
                        />
                    </div>

                    <div id="code-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.gWeight &&
                            state.errors.gWeight.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        담당자
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="manager"
                                name="manager"
                                placeholder="담당자를 입력하세요."
                                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                            />
                        </div>
                    </div>

                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.manager &&
                            state.errors.manager.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">아이템 생성</Button>
            </div>
        </form>
    );
}