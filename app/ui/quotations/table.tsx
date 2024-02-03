import { Quote } from "@prisma/client";
import { DeleteQuotation, QuotationDetail, UpdateQuotation } from "@/app/ui/quotations/buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function QuotationsTable({ quotations }: { quotations: Quote[] }) {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>담당자</TableHead>
                                <TableHead>작성자</TableHead>
                                <TableHead>g.weight</TableHead>
                                <TableHead>통화</TableHead>
                                <TableHead>환율</TableHead>
                                <TableHead>작성일</TableHead>
                                <TableHead>
                                    <span className="sr-only">Edit</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotations?.map((quotation) => (
                                <TableRow key={quotation.id}>
                                    <TableCell>{quotation.manager}</TableCell>
                                    <TableCell>{quotation.writer}</TableCell>
                                    <TableCell>{quotation.gWeight}</TableCell>
                                    <TableCell>{quotation.currency}</TableCell>
                                    <TableCell>{quotation.exchangeRate}</TableCell>
                                    <TableCell>{formatDateToLocal(quotation.createdAt)}</TableCell>
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
                </div>
            </div>
        </div>
    );
}
