"use client";

import { useFormState } from "react-dom";
import { Currency, Item, Quote } from "@prisma/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { createQuotationItem } from "@/app/lib/quotations/items/actions";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateValue } from "@/app/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export default function QuotationItemCreateForm({ items, quotation, currencies }: { items: Item[]; quotation: Quote; currencies: Currency[] }) {
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
                            <Button role="combobox" aria-expanded={open} className="w-full justify-between">
                                {value ? selections.find((selection) => selection.value === value)?.label : "아이템 선택..."}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command className="w-full">
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
                                            <CheckIcon className={cn("ml-auto h-4 w-4", value === selection.value ? "opacity-100" : "opacity-0")} />
                                            {selection.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {value && <Form key={value.id} item={value} quotation={quotation} currencies={currencies} />}
        </div>
    );
}

function Form({ item, quotation, currencies }: { item: Item; quotation: Quote; currencies: Currency[] }) {
    const initialState = { message: null, errors: {} };
    const calculatedValue = calculateValue(quotation.mode, quotation.value, quotation.grossWeight ?? 0);
    const [value, setValue] = useState(calculatedValue ?? 0);
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);
    const [open, setOpen] = useState(false);
    const [vatEnable, setVatEnable] = useState(item.vat);
    const [unitType, setUnitType] = useState(item.unitType);
    const [currency, setCurrency] = useState<string>();
    const createQuotationItemWithQuotationId = createQuotationItem.bind(null, quotation, currency, vatEnable);
    const [state, dispatch] = useFormState(createQuotationItemWithQuotationId, initialState);

    const selections = currencies.map((currency) => ({
        label: `${currency.code}`,
        value: currency,
    }));

    useEffect(() => {
        const temp = value * price;
        if (currency === "KRW") {
            setAmount(temp);
        } else {
            setAmount(temp * quotation.exchangeRate);
        }
    }, [value, price, currency, quotation.exchangeRate]);

    useEffect(() => {
        setCurrency(quotation.currency);
    }, [quotation]);

    const onUnitTypeChange = (value: string) => {
        setUnitType(value);
        if (value === "BL") {
            setValue(1);
        } else {
            setValue(calculatedValue ?? 0);
        }
    };

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="code" className="mb-2 block text-sm font-medium">
                        코드
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <Input id="code" name="code" readOnly value={item.code} placeholder="코드를 입력해주세요." aria-describedby="code-error" />
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
                            <Input id="name" name="name" defaultValue={item.name} placeholder="이름을 입력하세요." aria-describedby="name-error" />
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
                    <Select name="unit_type" aria-describedby="unitType-error" value={unitType} onValueChange={onUnitTypeChange}>
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
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.unitType &&
                            state.errors.unitType.map((error: string) => (
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
                                step={0.01}
                                value={value}
                                onFocus={(event) => event.target.select()}
                                onChange={(e) => setValue(parseFloat(e.target.value))}
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
                    <label htmlFor="price" className="mb-2 block text-sm font-medium">
                        price
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step={0.01}
                                value={price}
                                onFocus={(event) => event.target.select()}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                placeholder="price를 입력하세요."
                                aria-describedby="price-error"
                            />
                        </div>
                    </div>

                    <div id="price-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.price &&
                            state.errors.price.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <Input id="amount" name="amount" type="number" value={amount} step={0.01} readOnly aria-describedby="amount-error" />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <label htmlFor="vat" className="block text-sm font-medium">
                            VAT
                        </label>
                        <Checkbox id="vatEnable" name="vatEnable" checked={vatEnable} onClick={() => setVatEnable((prev) => !prev)} />
                    </div>

                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <Input
                                id="vat"
                                name="vat"
                                type="number"
                                value={vatEnable ? (amount / 10).toFixed(2) : 0}
                                step={0.01}
                                readOnly
                                aria-describedby="vat-error"
                            />
                        </div>
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
