import { CustomCellRendererProps } from "ag-grid-react";
import { formatWon } from "@/app/lib/utils";

export default function TotalRow(props: CustomCellRendererProps) {
    return <span className="font-bold">{formatWon(props.value)}</span>;
}
