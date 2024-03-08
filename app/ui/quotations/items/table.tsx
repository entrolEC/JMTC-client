"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { Currency, QuoteItem } from "@prisma/client";
import { DeleteQuotationItem } from "@/app/ui/quotations/items/buttons";
import { toast } from "sonner";
import { CellEditRequestEvent, ColDef, GetRowIdFunc, GetRowIdParams, GridReadyEvent } from "ag-grid-community";
import { updateQuotationItemWithObject } from "@/app/lib/quotations/items/actions";
import { QuoteWithCtnr } from "@/app/lib/definitions";

let rowImmutableStore: any[] = [];

export default function QuotationItemsTableAgGrid({
    quotationItems,
    quotation,
    currencies,
}: {
    quotationItems: QuoteItem[];
    quotation: QuoteWithCtnr;
    currencies: Currency[];
}) {
    const gridRef = useRef<AgGridReact<QuoteItem>>(null);
    const [state, setState] = useState({ message: "" });

    const columnDefs = useMemo<ColDef[]>(
        () => [
            { headerName: "코드", field: "code", sortable: true, filter: true, editable: false },
            { headerName: "이름", field: "name", width: 200, editable: false },
            {
                headerName: "U/T",
                field: "unitType",
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: ["CBM", "R.T", "BL", "KG", "40`", "20`", "SHIP"],
                },
            },
            { headerName: "VOLUME", field: "volume" },
            {
                headerName: "통화",
                field: "currency",
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: currencies.map((currency) => currency.name),
                },
            },
            { headerName: "PRICE", field: "price" },
            {
                headerName: "AMOUNT",
                field: "amount",
                valueFormatter: ({ value }) => new Intl.NumberFormat("ko", { style: "currency", currency: "KRW" }).format(value),
                editable: false,
            },
            {
                headerName: "VAT",
                field: "vat",
                valueFormatter: ({ value }) => new Intl.NumberFormat("ko", { style: "currency", currency: "KRW" }).format(value),
                editable: false,
            },
            {
                headerName: "삭제",
                cellRenderer: "deleteQuotationItem",
                cellEditorParams: {
                    quotationId: quotation.id,
                },
                width: 70,
                editable: false,
                sortable: false,
                filter: false,
            },
        ],
        [],
    );

    const defaultColDef = useMemo<ColDef>(
        () => ({
            editable: true,
            resizeable: true,
            filter: true,
            width: 120,
        }),
        [],
    );

    const onGridReady = useCallback((params: GridReadyEvent) => {
        rowImmutableStore = quotationItems;
    }, []);

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id;
    }, []);

    const onCellEditRequest = useCallback(
        (event: CellEditRequestEvent) => {
            const data = event.data;
            const field = event.colDef.field;
            const newValue = event.newValue;
            const oldItem = rowImmutableStore.find((row) => row.id === data.id);

            if (!oldItem || !field) {
                toast.error("잘못된 입력이거나 항목을 찾을 수 없습니다.");
                return;
            }
            const updatedItem = { ...oldItem, [field]: newValue };
            const promise = updateQuotationItemWithObject(updatedItem, quotation, state, new FormData());

            toast.promise(promise, {
                loading: "업데이트 중...",
                success: (data) => {
                    rowImmutableStore = rowImmutableStore.map((item) => (item.id == updatedItem.id ? updatedItem : item));
                    gridRef.current!.api.setRowData(rowImmutableStore);
                    return `견적서 항목 업데이트 완료.`;
                },
                error: (e) => `${e.message}`,
            });
        },
        [rowImmutableStore], // Add necessary dependencies here
    );

    return (
        <div className="w-full h-screen ag-theme-quartz">
            <AgGridReact
                ref={gridRef}
                components={{ deleteQuotationItem: DeleteQuotationItem }}
                rowData={quotationItems}
                onGridReady={onGridReady}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                getRowId={getRowId}
                readOnlyEdit={true}
                onCellEditRequest={onCellEditRequest}
                stopEditingWhenCellsLoseFocus
            />
        </div>
    );
}
