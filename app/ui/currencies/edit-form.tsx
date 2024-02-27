"use client";

import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCurrency } from "@/app/lib/currencies/actions";
import { Currency } from "@prisma/client";

export default function CurrencyEditForm({ currency }: { currency: Currency }) {
    const initialState = { message: null, errors: {} };
    const updateCurrencyWithId = updateCurrency.bind(null, currency.id);
    const [state, dispatch] = useFormState(updateCurrencyWithId, initialState);
    return (
        <form action={dispatch}>
            <div className="mb-4">
                <label htmlFor="code" className="mb-2 block text-sm font-medium">
                    코드
                </label>
                <div className="relative mt-2 rounded-md">
                    <Input id="code" name="code" placeholder="코드를 입력해주세요." defaultValue={currency.code} aria-describedby="code-error" />
                </div>

                <div id="code-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.code &&
                        state.errors.code.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    이름
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <Input id="name" name="name" defaultValue={currency.name} placeholder="이름을 입력하세요." aria-describedby="name-error" />
                    </div>
                </div>

                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name &&
                        state.errors.name.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <p className="mt-2 text-sm font-bold text-red-500">{state.message}</p>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">통화 수정</Button>
            </div>
        </form>
    );
}
