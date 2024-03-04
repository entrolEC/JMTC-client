"use client";

import { useFormState } from "react-dom";
import { Currency, Quote, QuoteItem } from "@prisma/client";
import { updateQuotationItem } from "@/app/lib/quotations/items/actions";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { calculateValue, getValueForUnitType } from "@/app/lib/bussinessUtil";
import { Checkbox } from "@/components/ui/checkbox";

export default function QuotationItemEditForm({
    quotationItem,
    quotation,
    currencies,
}: {
    quotationItem: QuoteItem;
    quotation: Quote;
    currencies: Currency[];
}) {
    const initialState = { message: null, errors: {} };
    const calculatedValue = calculateValue(quotation.mode, quotation.volume, quotation.grossWeight ?? 0);
    const [unitType, setUnitType] = useState(quotationItem.unitType);
    const [value, setValue] = useState(getValueForUnitType(unitType, calculatedValue ?? 0));
    const [price, setPrice] = useState(quotationItem.price);
    const [amount, setAmount] = useState(quotationItem.amount);
    const [open, setOpen] = useState(false);
    const [vatEnable, setVatEnable] = useState(quotationItem.vat > 0);
    const [currency, setCurrency] = useState<string | undefined>(quotationItem.currency || quotation.currency);
    const createQuotationItemWithQuotationId = updateQuotationItem.bind(null, quotation, quotationItem.id, currency, quotationItem.vat > 0);
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

    const onUnitTypeChange = (unitType: string) => {
        const newValue = getValueForUnitType(unitType, calculatedValue);
        setUnitType(unitType);
        setValue(newValue);
    };

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="code" className="mb-2 block text-sm font-medium">
                        코드
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <Input
                            id="code"
                            name="code"
                            readOnly
                            value={quotationItem.code}
                            placeholder="코드를 입력해주세요."
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
                            <Input
                                id="name"
                                name="name"
                                defaultValue={quotationItem.name}
                                placeholder="이름을 입력하세요."
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
                    <label htmlFor="volume" className="mb-2 block text-sm font-medium">
                        volume
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <Input
                                id="volume"
                                name="volume"
                                type="number"
                                step={0.01}
                                value={value}
                                onChange={(e) => setValue(parseFloat(e.target.value))}
                                placeholder="volume을 입력하세요."
                                aria-describedby="price-error"
                            />
                        </div>
                    </div>

                    <div id="price-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.volume &&
                            state.errors.volume.map((error: string) => (
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
                                value={quotationItem.vat ?? Math.round((amount / 10) * 100) / 100}
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
                <Button type="submit">견적서 항목 수정</Button>
            </div>
        </form>
    );
}
