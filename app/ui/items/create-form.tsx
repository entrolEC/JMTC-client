"use client";

import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { createItem } from "@/app/lib/items/actions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function ItemCreateForm() {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createItem, initialState);

    return (
        <form action={dispatch}>
            <div className="mb-4">
                <label htmlFor="code" className="mb-2 block text-sm font-medium">
                    코드
                </label>
                <div className="relative mt-2 rounded-md">
                    <Input id="code" name="code" placeholder="코드를 입력해주세요." aria-describedby="code-error" />
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
                        <Input id="name" name="name" placeholder="이름을 입력하세요." aria-describedby="name-error" />
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
            <div className="mb-4">
                <Select name="unit_type" aria-describedby="unitType-error">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="UnitType 선택.." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CBM">CBM</SelectItem>
                        <SelectItem value="R.T">R.T</SelectItem>
                        <SelectItem value="BL">BL</SelectItem>
                        <SelectItem value="KG">KG</SelectItem>
                        <SelectItem value="40`">40`</SelectItem>
                        <SelectItem value="20`">20`</SelectItem>
                        <SelectItem value="SHIP">SHIP</SelectItem>
                    </SelectContent>
                </Select>
                <div id="unit-type-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.unitType &&
                        state.errors.unitType.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="vat" name="vat" />
                    <label htmlFor="vat" className="mb-2 block text-sm font-medium">
                        VAT
                    </label>
                </div>
                <div id="vat-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.vat &&
                        state.errors.vat.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <p className="mt-2 text-sm font-bold text-red-500">{state.message}</p>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">아이템 생성</Button>
            </div>
        </form>
    );
}
