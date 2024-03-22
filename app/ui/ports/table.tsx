"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Port } from ".prisma/client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { DeletePort } from "@/app/ui/ports/buttons";
import { CellEditRequestEvent, ColDef, GetRowIdParams, GridReadyEvent } from "ag-grid-community";
import { toast } from "sonner";
import { updatePortWithObject } from "@/app/lib/ports/actions";

let rowImmutableStore: any[] = [];
export default function PortsTableAgGrid({ ports }: { ports: Port[] }) {
    const gridRef = useRef<AgGridReact<Port>>(null);
    const [state, setState] = useState({ message: "" });

    const columnDefs = useMemo<ColDef[]>(
        () => [
            { headerName: "코드", field: "code", sortable: true, filter: true, sort: "desc" },
            { headerName: "이름", field: "name", filter: true },
            { headerName: "설명", field: "description" },
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
            rowImmutableStore = ports;
        },
        [ports],
    );

    const getRowId = useCallback((params: GetRowIdParams) => params.data.id, []);

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
            const updatedPort = { ...oldItem, [field]: newValue };
            const promise = updatePortWithObject(updatedPort, state, new FormData());

            toast.promise(promise, {
                loading: "업데이트 중...",
                success: (data) => {
                    rowImmutableStore = rowImmutableStore.map((port) => (port.id == updatedPort.id ? updatedPort : port));
                    gridRef.current!.api.setRowData(rowImmutableStore);
                    return `항목 업데이트 완료.`;
                },
                error: (e) => `${e.message}`,
            });
        },
        [rowImmutableStore],
    );

    return (
        <div className="ag-theme-quartz w-full h-screen">
            <AgGridReact
                ref={gridRef}
                components={{
                    deletePort: DeletePort,
                }}
                rowData={ports}
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
