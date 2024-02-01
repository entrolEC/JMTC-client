"use client";

import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";
import { createItem } from "@/app/lib/items/actions";

export default function ItemCreateForm() {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createItem, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Invoice Amount */}
                <div className="mb-4">
                    <label htmlFor="code" className="mb-2 block text-sm font-medium">
                        코드
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <input
                            id="code"
                            name="code"
                            placeholder="코드를 입력해주세요."
                            className="px-2 peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="code-error"
                        />
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
                            <input
                                id="name"
                                name="name"
                                placeholder="이름을 입력하세요."
                                className="px-2 peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                            />
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
            </div>
            <p className="mt-2 text-sm font-bold text-red-500">{state.message}</p>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">아이템 생성</Button>
            </div>
        </form>
    );
}
