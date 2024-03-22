"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { Currency } from "@prisma/client";
import { DeleteQuotationItem } from "@/app/ui/quotations/items/buttons";
import { toast } from "sonner";
import { CellEditRequestEvent, ColDef, GetRowIdFunc, GetRowIdParams, GridReadyEvent, RowDragEndEvent, RowDragEnterEvent } from "ag-grid-community";
import { updateQuotationItemWithObject } from "@/app/lib/quotations/items/actions";
import { QuoteItemOrder, QuoteWithCtnr } from "@/app/lib/definitions";
import { formatWon } from "@/app/lib/utils";
import TotalRow from "@/app/ui/quotations/items/total-row";

let dragStartIndex: null | number = null;
let rowImmutableStore: any[] = [];
export default function QuotationItemsTableAgGrid({
    quotationItems,
    quotation,
    currencies,
}: {
    quotationItems: QuoteItemOrder[];
    quotation: QuoteWithCtnr;
    currencies: Currency[];
}) {
    const height = quotationItems.length * 42 + 92;
    const gridRef = useRef<AgGridReact<QuoteItemOrder>>(null);
    const [state, setState] = useState({ message: "" });

    const columnDefs = useMemo<ColDef[]>(
        () => [
            { headerName: "", field: "order", rowDrag: true },
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
                valueFormatter: ({ value }) => formatWon(value),
                editable: false,
            },
            {
                headerName: "VAT",
                field: "vat",
                valueFormatter: ({ value }) => formatWon(value),
                editable: false,
            },
            {
                headerName: "삭제",
                field: "delete",
                cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            component: TotalRow,
                        };
                    }
                },
                valueFormatter: ({ value }) => formatWon(value),
                cellRenderer: "deleteQuotationItem",
                cellEditorParams: {
                    quotationId: quotation.id,
                },
                width: 200,
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

    const onGridReady = useCallback(
        (params: GridReadyEvent) => {
            rowImmutableStore = quotationItems;
        },
        [quotationItems],
    );

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id;
    }, []);

    const pinnedBottomRowData = useCallback((): any[] => {
        const amountSum = quotationItems.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0);
        const vatSum = quotationItems.reduce((previousValue, currentValue) => previousValue + currentValue.vat, 0);
        return [{ amount: amountSum, vat: vatSum, delete: amountSum + vatSum }];
    }, [quotationItems]);

    const onCellEditRequest = useCallback(
        (event: CellEditRequestEvent) => {
            const data = event.data;
            const field = event.colDef.field;
            const newValue = event.newValue;
            const oldItem = quotationItems.find((row) => row.id === data.id);

            if (!oldItem || !field) {
                toast.error("잘못된 입력이거나 항목을 찾을 수 없습니다.");
                return;
            }
            const updatedItem = { ...oldItem, [field]: newValue };
            const promise = updateQuotationItemWithObject(updatedItem, quotation, state, new FormData());

            toast.promise(promise, {
                loading: "업데이트 중...",
                success: (data) => {
                    quotationItems = quotationItems.map((item) => (item.id == updatedItem.id ? updatedItem : item));
                    gridRef.current!.api.setRowData(quotationItems);
                    return `견적서 항목 업데이트 완료.`;
                },
                error: (e) => `${e.message}`,
            });
        },
        [quotationItems], // Add necessary dependencies here
    );

    const onRowDragEnter = useCallback((e: RowDragEnterEvent) => {
        dragStartIndex = e.overIndex;
    }, []);

    const onRowDragEnd = useCallback(
        (e: RowDragEndEvent) => {
            if (e.overIndex === -1 || dragStartIndex === null) return;
            const oldItem = e.node.data;
            let newPosition = e.node.data.position;
            const constant = e.overIndex > dragStartIndex ? 1 : 0;
            if (e.overIndex === 0) {
                newPosition = rowImmutableStore[0].position - 1;
            } else if (e.overIndex === rowImmutableStore.length - 1) {
                newPosition = rowImmutableStore[rowImmutableStore.length - 1].position + 1;
            } else {
                const prevPosition = rowImmutableStore[e.overIndex - 1 + constant].position;
                const nextPosition = rowImmutableStore[e.overIndex + constant].position;
                newPosition = (prevPosition + nextPosition) / 2;
            }
            const updatedItem = { ...oldItem, position: newPosition };
            const promise = updateQuotationItemWithObject(updatedItem, quotation, state, new FormData());
            console.log("newPosition", newPosition);

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
        [rowImmutableStore],
    );

    return (
        <div className="w-full ag-theme-quartz" style={{ height: height }}>
            <AgGridReact
                ref={gridRef}
                components={{ deleteQuotationItem: DeleteQuotationItem }}
                rowData={quotationItems}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                getRowId={getRowId}
                readOnlyEdit
                onCellEditRequest={onCellEditRequest}
                pinnedBottomRowData={pinnedBottomRowData()}
                onRowDragEnd={onRowDragEnd}
                onRowDragEnter={onRowDragEnter}
                onGridReady={onGridReady}
                rowDragManaged
                stopEditingWhenCellsLoseFocus
            />
        </div>
    );
}
