import { Quote } from "@prisma/client";
import { DeleteQuotation, QuotationDetail, UpdateQuotation } from "@/app/ui/quotations/buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function QuotationsTable({ quotations }: { quotations: Quote[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>모드</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>value</TableHead>
                    <TableHead>G.Weight</TableHead>
                    <TableHead>통화</TableHead>
                    <TableHead>환율</TableHead>
                    <TableHead>Port of Loading</TableHead>
                    <TableHead>Port of Discharge</TableHead>
                    <TableHead>CTNR</TableHead>
                    <TableHead>INCOTERMS</TableHead>
                    <TableHead className="text-right">작성일</TableHead>
                    <TableHead>
                        <span className="sr-only">Edit</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quotations?.map((quotation) => (
                    <TableRow key={quotation.id}>
                        <TableCell className="font-bold">{quotation.mode}</TableCell>
                        <TableCell>{quotation.manager}</TableCell>
                        <TableCell>{quotation.writer}</TableCell>
                        <TableCell>{quotation.value}</TableCell>
                        <TableCell>{quotation.grossWeight ?? "-"}</TableCell>
                        <TableCell>{quotation.currency}</TableCell>
                        <TableCell>{quotation.exchangeRate}</TableCell>
                        <TableCell>{quotation.loadingPort}</TableCell>
                        <TableCell>{quotation.dischargePort}</TableCell>
                        <TableCell>{quotation.ctnr}</TableCell>
                        <TableCell>{quotation.incoterm}</TableCell>
                        <TableCell className="text-right">{formatDateToLocal(quotation.createdAt)}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-3">
                                <QuotationDetail id={quotation.id} />
                                <UpdateQuotation id={quotation.id} />
                                <DeleteQuotation id={quotation.id} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
