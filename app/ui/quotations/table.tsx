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
import { Currency } from "@prisma/client";
import { Ctnr, Incoterm, Port } from ".prisma/client";
import CtnrCombobox from "@/app/ui/ctnrs/ctnr-combobox";
import { DeleteQuotation, QuotationDetail } from "@/app/ui/quotations/buttons";

let rowImmutableStore: any[] = [];
export default function QuotationsTable({
    quotations,
    currencies,
    ports,
    ctnrs,
    incoterms,
}: {
    quotations: QuoteWithCtnr[];
    currencies: Currency[];
    ports: Port[];
    ctnrs: Ctnr[];
    incoterms: Incoterm[];
}) {
    const gridRef = useRef<AgGridReact<QuoteWithCtnr>>(null);
    const [state, setState] = useState({ message: "" }); // Initialize state for error messages

    const [columnDefs, setColumnDefs] = useState<(ColDef<any, any> | ColGroupDef<any>)[]>([
        {
            headerName: "상세",
            cellRenderer: "quotationDetail",
            width: 70,
            editable: false,
            sortable: false,
            filter: false,
        },
        {
            headerName: "모드",
            field: "mode",
            editable: false,
        },
        {
            headerName: "CARGO MODE",
            field: "cargoMode",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ["LCL", "FCL", "AIR_CARGO"],
            },
        },
        { headerName: "담당자", field: "manager" },
        { headerName: "작성자", field: "writer", editable: false },
        { headerName: "VOLUME", field: "volume" },
        { headerName: "G.WEIGHT", field: "grossWeight", valueFormatter: (params) => params.value ?? "-" },
        {
            headerName: "통화",
            field: "currency",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: currencies.map((currency) => currency.name),
            },
        },
        { headerName: "환율", field: "exchangeRate" },
        {
            headerName: "PORT OF LOADING",
            field: "loadingPort",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ports.map((port) => port.name),
            },
            width: 200,
        },
        {
            headerName: "PORT OF DISCHARGE",
            field: "dischargePort",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ports.map((port) => port.name),
            },
            width: 200,
        },
        {
            headerName: "CTNR",
            field: "ctnr",
            cellEditor: "customCtnrEditor",
            cellEditorParams: {
                ctnrs: ctnrs,
            },
            valueGetter: (params) => ctnrs.find((ctnr) => ctnr.id === params.data.ctnr.id)?.name,
        },
        {
            headerName: "INCOTERMS",
            field: "incoterm",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: incoterms.map((incoterm) => incoterm.name),
            },
        },
        { headerName: "작성일", field: "createdAt", valueFormatter: (params) => formatDateToLocal(params.value), editable: false, sort: "desc" },
        {
            headerName: "삭제",
            cellRenderer: "deleteQuotation",
            width: 70,
            editable: false,
            sortable: false,
            filter: false,
        },
    ]);

    const onGridReady = useCallback((params: GridReadyEvent) => {
        rowImmutableStore = quotations;
    }, []);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: true,
            resizeable: true,
            filter: true,
            width: 150,
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
            <AgGridReact
                ref={gridRef}
                components={{ customCtnrEditor: CtnrCombobox, quotationDetail: QuotationDetail, deleteQuotation: DeleteQuotation }}
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
