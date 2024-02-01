"use client";

import { useFormState } from "react-dom";
import { Item } from "@prisma/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Button } from "@/app/ui/button";
import { createQuotationItem } from "@/app/lib/quotations/items/actions";

export default function QuotationItemCreateForm({ items, quotationId }: { items: Item[]; quotationId: string }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<Item>();
    const selections = items.map((item) => ({
        label: `${item.code} - ${item.name}`,
        value: item,
    }));

    const findItemByCode = useCallback(
        (code: string) => {
            return items.find((item) => item.code.toLowerCase() === code.toLowerCase());
        },
        [items],
    );

    return (
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
            <div className="mb-4">
                <label htmlFor="items" className="mb-2 block text-sm font-medium">
                    코드 선택
                </label>
                <div className="relative">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <ShadcnButton role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                {value ? selections.find((selection) => selection.value === value)?.label : "아이템 선택..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </ShadcnButton>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="아이템 선택..." />
                                <CommandEmpty>No item found.</CommandEmpty>
                                <CommandGroup>
                                    {selections.map((selection) => (
                                        <CommandItem
                                            key={selection.value.id}
                                            value={selection.value.code}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value?.code ? undefined : findItemByCode(currentValue));
                                                setOpen(false);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", value === selection.value ? "opacity-100" : "opacity-0")} />
                                            {selection.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {value && <Form key={value.id} item={value} quotationId={quotationId} />}
        </div>
    );
}

function Form({ item, quotationId }: { item: Item; quotationId: string }) {
    const initialState = { message: null, errors: {} };
    const createQuotationItemWithQuotationId = createQuotationItem.bind(null, quotationId);
    const [state, dispatch] = useFormState(createQuotationItemWithQuotationId, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="code" className="mb-2 block text-sm font-medium">
                        코드
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <input
                            id="code"
                            name="code"
                            readOnly
                            value={item.code}
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
                                defaultValue={item.name}
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
                <Button type="submit">견적서 항목 생성</Button>
            </div>
        </form>
    );
}
