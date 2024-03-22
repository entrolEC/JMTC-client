"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Incoterm } from ".prisma/client";
import { CellEditRequestEvent, ColDef, GetRowIdParams, GridReadyEvent } from "ag-grid-community";
import { DeleteIncoterm } from "@/app/ui/incoterms/buttons";
import { toast } from "sonner";
import { updateIncotermWithObject } from "@/app/lib/incoterms/actions";

let rowImmutableStore: Incoterm[] = [];

export default function IncotermsTableAgGrid({ incoterms }: { incoterms: Incoterm[] }) {
    const gridRef = useRef<AgGridReact<Incoterm>>(null);
    const [state, setState] = useState({ message: "" });

    const columnDefs = useMemo<ColDef[]>(
        () => [
            { headerName: "코드", field: "code", sortable: true, filter: true, sort: "desc" },
            { headerName: "이름", field: "name", filter: true },
            { headerName: "설명", field: "description" },
            { headerName: "삭제", cellRenderer: "deleteIncoterm", width: 70, editable: false, sortable: false, filter: false },
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
            rowImmutableStore = incoterms;
        },
        [incoterms],
    );

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
            const updatedIncoterm = { ...oldItem, [field]: newValue };
            const promise = updateIncotermWithObject(updatedIncoterm, state, new FormData());

            toast.promise(promise, {
                loading: "업데이트 중...",
                success: (data) => {
                    rowImmutableStore = rowImmutableStore.map((incoterm) => (incoterm.id == updatedIncoterm.id ? updatedIncoterm : incoterm));
                    gridRef.current!.api.setRowData(rowImmutableStore);
                    return `항목 업데이트 완료.`;
                },
                error: (e) => `${e.message}`,
            });
        },
        [rowImmutableStore],
    );

    const getRowId = useCallback((params: GetRowIdParams) => params.data.id, []);

    return (
        <div className="ag-theme-quartz w-full h-screen">
            <AgGridReact
                ref={gridRef}
                components={{
                    deleteIncoterm: DeleteIncoterm,
                }}
                rowData={incoterms}
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
