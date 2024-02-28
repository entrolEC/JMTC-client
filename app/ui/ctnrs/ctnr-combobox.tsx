"use client";
import React, { forwardRef, Ref, useImperativeHandle, useState } from "react";
import { ICellEditorParams } from "ag-grid-community";
import { Ctnr } from ".prisma/client";

interface CustomCtnrEditorProps extends ICellEditorParams {
    ctnrs: Ctnr[];
}

const CtnrCombobox = (props: CustomCtnrEditorProps, ref: Ref<any>) => {
    const [ctnr, setCtnr] = useState<string>(props.data.ctnr.id);
    useImperativeHandle(ref, () => ({
        // AG Grid가 셀의 값을 얻기 위해 호출하는 메소드
        getValue: () => {
            // 사용자가 선택한 ctnr 객체를 반환
            return props.ctnrs.find((_ctnr) => _ctnr.id === ctnr);
        },
    }));

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCtnr(event.target.value);
    };

    return (
        <select value={ctnr} onChange={handleChange} style={{ width: "100%" }} ref={ref}>
            {props.ctnrs.map((ctnr, index) => (
                <option key={index} value={ctnr.id}>
                    {ctnr.name}
                </option>
            ))}
        </select>
    );
};

export default forwardRef(CtnrCombobox);
