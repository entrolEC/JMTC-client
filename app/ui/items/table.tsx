"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Item } from "@prisma/client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { formatDateToLocal } from "@/app/lib/utils";
import { DeleteItem } from "@/app/ui/items/buttons";
import { CellEditRequestEvent, ColDef, ColGroupDef, GetRowIdFunc, GetRowIdParams, GridReadyEvent } from "ag-grid-community";
import { toast } from "sonner";
import { updateItemWithObject } from "@/app/lib/items/actions";

let rowImmutableStore: any[] = [];
export default function ItemsTableAgGrid({ items }: { items: Item[] }) {
    const gridRef = useRef<AgGridReact<Item>>(null);
    const [state, setState] = useState({ message: "" });

    const columnDefs = useMemo<(ColDef<any, any> | ColGroupDef<any>)[]>(
        () => [
            { headerName: "코드", field: "code", sortable: true, filter: true },
            { headerName: "이름", field: "name", filter: true, width: 400 },
            {
                headerName: "U/T",
                field: "unitType",
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: ["CBM", "R.T", "BL", "KG", "40`", "20`", "SHIP"],
                },
            },
            {
                headerName: "VAT",
                field: "vat",
                width: 100,
            },
            {
                headerName: "작성일",
                field: "createdAt",
                valueFormatter: (params) => formatDateToLocal(params.value),
                editable: false,
                sort: "desc",
            },
            {
                headerName: "삭제",
                cellRenderer: "deleteItem",
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
            width: 200,
        }),
        [],
    );

    const onGridReady = useCallback(
        (params: GridReadyEvent) => {
            rowImmutableStore = items;
        },
        [items],
    );

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
            const promise = updateItemWithObject(updatedItem, state, new FormData());

            toast.promise(promise, {
                loading: "업데이트 중...",
                success: (data) => {
                    rowImmutableStore = rowImmutableStore.map((item) => (item.id == updatedItem.id ? updatedItem : item));
                    gridRef.current!.api.setRowData(rowImmutableStore);
                    return `항목 업데이트 완료.`;
                },
                error: (e) => `${e.message}`,
            });
        },
        [rowImmutableStore], // Add necessary dependencies here
    );

    return (
        <div className="ag-theme-quartz w-full h-screen">
            <AgGridReact
                ref={gridRef}
                components={{ deleteItem: DeleteItem }}
                rowData={items}
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
