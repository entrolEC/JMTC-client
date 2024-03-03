"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css"; // Import AG Grid styles
import "ag-grid-community/styles/ag-theme-quartz.css"; // Import AG Grid theme
import { AgGridReact } from "ag-grid-react"; // Import AG Grid React
import { QuoteItem } from "@prisma/client";
import { DeleteQuotationItem, UpdateQuotationItem } from "@/app/ui/quotations/items/buttons";
import { toast } from "sonner";
import { CellEditRequestEvent, ColDef, GetRowIdFunc, GetRowIdParams, GridReadyEvent } from "ag-grid-community";
import { updateQuotationItemWithObject } from "@/app/lib/quotations/items/actions";
import { QuoteWithCtnr } from "@/app/lib/definitions";

let rowImmutableStore: any[] = [];

export default function QuotationItemsTableAgGrid({ quotationItems, quotation }: { quotationItems: QuoteItem[]; quotation: QuoteWithCtnr }) {
    const gridRef = useRef<AgGridReact<QuoteItem>>(null);
    const [state, setState] = useState({ message: "" });

    const columnDefs = useMemo<ColDef[]>(
        () => [
            { headerName: "코드", field: "code", sortable: true, filter: true, editable: false },
            { headerName: "이름", field: "name", width: 200, editable: false },
            { headerName: "U/T", field: "unitType" },
            { headerName: "Value", field: "value" },
            { headerName: "통화", field: "currency" },
            { headerName: "Price", field: "price" },
            {
                headerName: "Amount",
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
                headerName: "Actions",
                cellRendererFramework: (params: GetRowIdParams) => (
                    <div className="flex justify-end gap-3">
                        <UpdateQuotationItem quotationId={params.data.quote_id} id={params.data.id} />
                        <DeleteQuotationItem quotationId={params.data.quote_id} id={params.data.id} />
                    </div>
                ),
                filter: false,
                sortable: false,
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
            console.log("newItem", updatedItem);
            const promise = updateQuotationItemWithObject(updatedItem, quotation, state, new FormData());

            toast.promise(promise, {
                loading: "업데이트 중...",
                success: (data) => {
                    rowImmutableStore = rowImmutableStore.map((item) => (item.id == updatedItem.id ? updatedItem : item));
                    gridRef.current!.api.setRowData(rowImmutableStore);
                    return `견적서 업데이트 완료.`;
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
