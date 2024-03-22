"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Ctnr } from ".prisma/client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { DeleteCtnr } from "@/app/ui/ctnrs/buttons";
import { CellEditRequestEvent, ColDef, ColGroupDef, GetRowIdFunc, GetRowIdParams, GridReadyEvent } from "ag-grid-community";
import { toast } from "sonner";
import { updateCtnrWithObject } from "@/app/lib/ctnrs/actions";

let rowImmutableStore: Ctnr[] = [];

export default function CtnrsTableAgGrid({ ctnrs }: { ctnrs: Ctnr[] }) {
    const gridRef = useRef<AgGridReact<Ctnr>>(null);
    const [state, setState] = useState({ message: "" });

    const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(
        () => [
            { headerName: "코드", field: "code", sortable: true, filter: true, sort: "desc" },
            { headerName: "이름", field: "name", filter: true },
            { headerName: "컨테이너 모드", field: "containerMode" },
            { headerName: "설명", field: "description" },
            { headerName: "삭제", cellRenderer: "deleteCtnr", width: 70, editable: false, sortable: false, filter: false },
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
            rowImmutableStore = ctnrs;
        },
        [ctnrs],
    );

    const getRowId = useMemo<GetRowIdFunc>(() => (params: GetRowIdParams) => params.data.id, []);

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
            const promise = updateCtnrWithObject(updatedItem, state, new FormData());

            toast.promise(promise, {
                loading: "업데이트 중...",
                success: (data) => {
                    rowImmutableStore = rowImmutableStore.map((ctnr) => (ctnr.id == updatedItem.id ? updatedItem : ctnr));
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
                components={{ deleteCtnr: DeleteCtnr }}
                rowData={ctnrs}
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
