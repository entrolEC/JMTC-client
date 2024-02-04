"use client";

import { useFormState } from "react-dom";
import { Currency, Quote } from "@prisma/client";
import { updateQuotation } from "@/app/lib/quotations/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function QuotationEditForm({ quotation, currencies }: { quotation: Quote; currencies: Currency[] }) {
    const initialState = { message: null, errors: {} };
    const updateQuotationWithId = updateQuotation.bind(null, quotation.id);
    const [state, dispatch] = useFormState(updateQuotationWithId, initialState);
    const [open, setOpen] = useState(false);
    const [currency, setCurrency] = useState<string | undefined>(quotation.currency);

    const selections = currencies.map((currency) => ({
        label: `${currency.code}`,
        value: currency,
    }));

    return (
        <form action={dispatch}>
            <div className="rounded-md p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="currency" className="mb-2 block text-sm font-medium">
                        통화 선택
                    </label>
                    <div className="relative">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button name="currency" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                    {currency ? selections.find((selection) => selection.value.code === currency)?.label : "아이템 선택...."}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
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
                                                    setCurrency(currentValue === currency ? undefined : currentValue.toUpperCase());
                                                    setOpen(false);
                                                }}
                                            >
                                                <CheckIcon
                                                    className={cn("ml-auto h-4 w-4", currency === selection.value.code ? "opacity-100" : "opacity-0")}
                                                />
                                                {selection.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div id="currency-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.currency &&
                            state.errors.currency.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="exchange_rate" className="mb-2 block text-sm font-medium">
                        환율
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <Input
                            id="exchange_reate"
                            name="exchange_rate"
                            type="number"
                            defaultValue={quotation.exchangeRate}
                            step={0.0001}
                            placeholder="환율을 입력하세요"
                            aria-describedby="exchange_rate-error"
                        />
                    </div>

                    <div id="exchange_rate-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.exchangeRate &&
                            state.errors.exchangeRate.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="value" className="mb-2 block text-sm font-medium">
                        value
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <Input
                                id="value"
                                name="value"
                                type="number"
                                defaultValue={quotation.value}
                                step={0.01}
                                placeholder="value를 입력하세요."
                                aria-describedby="price-error"
                            />
                        </div>
                    </div>

                    <div id="price-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.value &&
                            state.errors.value.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="manager" className="mb-2 block text-sm font-medium">
                        담당자
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <Input
                            id="manager"
                            name="manager"
                            placeholder="담당자를 입력하세요."
                            defaultValue={quotation.manager}
                            aria-describedby="manager-error"
                        />
                    </div>

                    <div id="manager-error" aria-live="polite" aria-atomic="true">
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
