"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css"; // Import AG Grid styles
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme style of your choice
import { AgGridReact } from "ag-grid-react"; // Import AG Grid React
import { QuoteWithCtnr } from "@/app/lib/definitions"; // Assuming this utility is suitable for your date formatting needs
import { CellEditRequestEvent, ColDef, ColGroupDef, GetRowIdFunc, GetRowIdParams, GridReadyEvent } from "ag-grid-community";
import { formatDateToLocal } from "@/app/lib/utils";
import { updateQuotationWithObject } from "@/app/lib/quotations/actions";
import { toast } from "sonner";

let rowImmutableStore: any[] = [];
export default function QuotationsTable({ quotations }: { quotations: QuoteWithCtnr[] }) {
    const gridRef = useRef<AgGridReact<QuoteWithCtnr>>(null);
    const [state, setState] = useState({ message: "" }); // Initialize state for error messages

    const [columnDefs, setColumnDefs] = useState<(ColDef<any, any> | ColGroupDef<any>)[]>([
        {
            headerName: "모드",
            field: "mode",
            editable: false,
        },
        {
            headerName: "Cargo mode",
            field: "cargoMode",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ["LCL", "FCL", "AIR_CARGO"],
            },
        },
        { headerName: "담당자", field: "manager" },
        { headerName: "작성자", field: "writer" },
        { headerName: "Value", field: "value" },
        { headerName: "G.Weight", field: "grossWeight", valueFormatter: (params) => params.value ?? "-" },
        { headerName: "통화", field: "currency" },
        { headerName: "환율", field: "exchangeRate" },
        { headerName: "Port of Loading", field: "loadingPort" },
        { headerName: "Port of Discharge", field: "dischargePort" },
        { headerName: "CTNR", field: "ctnr.name" },
        { headerName: "INCOTERMS", field: "incoterm" },
        { headerName: "작성일", field: "createdAt", valueFormatter: (params) => formatDateToLocal(params.value), cellClass: "text-right" },
    ]);

    const onGridReady = useCallback((params: GridReadyEvent) => {
        rowImmutableStore = quotations;
    }, []);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: true,
            sortable: true,
            resizeable: true,
            filter: true,
        };
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
            const promise = updateQuotationWithObject(updatedItem, state, new FormData());

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
            <p className="mt-2 text-sm font-bold text-red-500">{state.message}</p>
            <AgGridReact
                ref={gridRef}
                onGridReady={onGridReady}
                rowData={quotations}
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
