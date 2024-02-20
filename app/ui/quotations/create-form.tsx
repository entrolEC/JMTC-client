"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Currency } from "@prisma/client";
import { useFormState } from "react-dom";
import { createQuotation } from "@/app/lib/quotations/actions";
import { Input } from "@/components/ui/input";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ctnr, Incoterm, Port } from ".prisma/client";

export default function QuotationCreateForm({
    currencies,
    ports,
    ctnrs,
    incoterms,
}: {
    currencies: Currency[];
    ports: Port[];
    ctnrs: Ctnr[];
    incoterms: Incoterm[];
}) {
    const initialState = { message: null, errors: {} };

    const [open, setOpen] = useState(false);
    const [loadingPortOpen, setLoadingPortOpen] = useState(false);
    const [dischargePortOpen, setDischargePortOpen] = useState(false);
    const [ctnrOpen, setCtnrOpen] = useState(false);
    const [incotermOpen, setIncotermOpen] = useState(false);
    const [currency, setCurrency] = useState<string>();
    const [loadingPort, setLoadingPort] = useState<Port>();
    const [dischargePort, setDischargePort] = useState<Port>();
    const [ctnr, setCtnr] = useState<Ctnr>();
    const [incoterm, setIncoterm] = useState<Incoterm>();
    const createQuotationWithSelection = createQuotation.bind(null, currency, loadingPort?.name, dischargePort?.name, ctnr?.name, incoterm?.name);
    const [state, dispatch] = useFormState(createQuotationWithSelection, initialState);

    const currencySelections = currencies.map((currency) => ({
        label: `${currency.code}`,
        value: currency,
    }));

    const portSelections = ports.map((port) => ({
        label: `${port.code} - ${port.name}`,
        value: port,
    }));

    const ctnrSelections = ctnrs.map((ctnr) => ({
        label: `${ctnr.code} - ${ctnr.name}`,
        value: ctnr,
    }));

    const incotermSelecions = incoterms.map((incoterm) => ({
        label: `${incoterm.code} - ${incoterm.name}`,
        value: incoterm,
    }));

    return (
        <form action={dispatch}>
            <div className="rounded-md p-4 md:p-6">
                <div className="mb-4">
                    <Select name="mode" aria-describedby="mode-error">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="mode 선택.." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="OCN IMPORT">OCN IMPORT</SelectItem>
                            <SelectItem value="AIR IMPORT">AIR IMPORT</SelectItem>
                            <SelectItem value="OCN EXPORT">OCN EXPORT</SelectItem>
                            <SelectItem value="AIR EXPORT">AIR EXPORT</SelectItem>
                        </SelectContent>
                    </Select>
                    <div id="mode-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.mode &&
                            state.errors.mode.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="mb-4">
                        <label htmlFor="loading_port" className="mb-2 block text-sm font-medium">
                            Port of Loading
                        </label>
                        <div className="relative">
                            <Popover open={loadingPortOpen} onOpenChange={setLoadingPortOpen}>
                                <PopoverTrigger asChild>
                                    <Button name="loading_port" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                        {loadingPort
                                            ? portSelections.find((selection) => selection.value.id === loadingPort.id)?.label
                                            : "아이템 선택...."}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="port 선택..." />
                                        <CommandEmpty>No item found.</CommandEmpty>
                                        <CommandGroup>
                                            {portSelections.map((port) => (
                                                <CommandItem
                                                    key={port.value.id}
                                                    value={port.value.id}
                                                    onSelect={(currentValue) => {
                                                        setLoadingPort(ports.find((port) => port.id === currentValue));
                                                        setLoadingPortOpen(false);
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            loadingPort?.id === port.value.id ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    {port.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div id="currency-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.loadingPort &&
                                state.errors.loadingPort.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="discharge_port" className="mb-2 block text-sm font-medium">
                            Port of Discharge
                        </label>
                        <div className="relative">
                            <Popover open={dischargePortOpen} onOpenChange={setDischargePortOpen}>
                                <PopoverTrigger asChild>
                                    <Button name="discharge_port" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                        {dischargePort
                                            ? portSelections.find((selection) => selection.value.id === dischargePort.id)?.label
                                            : "아이템 선택...."}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="port 선택..." />
                                        <CommandEmpty>No item found.</CommandEmpty>
                                        <CommandGroup>
                                            {portSelections.map((port) => (
                                                <CommandItem
                                                    key={port.value.id}
                                                    value={port.value.id}
                                                    onSelect={(currentValue) => {
                                                        setDischargePort(ports.find((port) => port.id === currentValue));
                                                        setDischargePortOpen(false);
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            dischargePort?.id === port.value.id ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    {port.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div id="currency-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.dischargePort &&
                                state.errors.dischargePort.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="mb-4">
                        <label htmlFor="ctnr" className="mb-2 block text-sm font-medium">
                            ctnr
                        </label>
                        <div className="relative">
                            <Popover open={ctnrOpen} onOpenChange={setCtnrOpen}>
                                <PopoverTrigger asChild>
                                    <Button name="ctnr" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                        {ctnr ? ctnrSelections.find((selection) => selection.value.id === ctnr.id)?.label : "아이템 선택...."}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="ctnr 선택..." />
                                        <CommandEmpty>No item found.</CommandEmpty>
                                        <CommandGroup>
                                            {ctnrSelections.map((ctnrSelection) => (
                                                <CommandItem
                                                    key={ctnrSelection.value.id}
                                                    value={ctnrSelection.value.id}
                                                    onSelect={(currentValue) => {
                                                        setCtnr(ctnrs.find((ctnr) => ctnr.id === currentValue));
                                                        setCtnrOpen(false);
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            ctnr?.id === ctnrSelection.value.id ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    {ctnrSelection.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div id="currency-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.ctnr &&
                                state.errors.ctnr.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ctnr" className="mb-2 block text-sm font-medium">
                            incoterms
                        </label>
                        <div className="relative">
                            <Popover open={incotermOpen} onOpenChange={setIncotermOpen}>
                                <PopoverTrigger asChild>
                                    <Button name="ctnr" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                        {dischargePort
                                            ? incotermSelecions.find((selection) => selection.value.id === incoterm?.id)?.label
                                            : "아이템 선택...."}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="incoterms 선택..." />
                                        <CommandEmpty>No item found.</CommandEmpty>
                                        <CommandGroup>
                                            {incotermSelecions.map((incotermSelection) => (
                                                <CommandItem
                                                    key={incotermSelection.value.id}
                                                    value={incotermSelection.value.id}
                                                    onSelect={(currentValue) => {
                                                        setIncoterm(incoterms.find((incoterm) => incoterm.id === currentValue));
                                                        setIncotermOpen(false);
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            incoterm?.id === incotermSelection.value.id ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    {incotermSelection.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div id="currency-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.incoterm &&
                                state.errors.incoterm.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
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
                                    {currency ? currencySelections.find((selection) => selection.value.code === currency)?.label : "아이템 선택...."}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="통화 선택..." />
                                    <CommandEmpty>No item found.</CommandEmpty>
                                    <CommandGroup>
                                        {currencySelections.map((selection) => (
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
                            step={0.01}
                            placeholder="환율을 입력하세요"
                            aria-describedby="manager-error"
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
                    <label htmlFor="grossWeight" className="mb-2 block text-sm font-medium">
                        GrossWeight
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <Input
                                id="grossWeight"
                                name="grossWeight"
                                type="number"
                                step={0.01}
                                placeholder="GrossWeight를 입력하세요. (필수 아님)"
                                aria-describedby="price-error"
                            />
                        </div>
                    </div>

                    <div id="grossWeight-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.grossWeight &&
                            state.errors.grossWeight.map((error: string) => (
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
                        <Input id="manager" name="manager" placeholder="담당자를 입력하세요." aria-describedby="manager-error" />
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
