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
                                <TableHead className="px-4 py-5 font-medium sm:pl-6">담당자</TableHead>
                                <TableHead className="px-3 py-5 font-medium">작성자</TableHead>
                                <TableHead className="px-3 py-5 font-medium">g.weight</TableHead>
                                <TableHead className="px-3 py-5 font-medium">통화</TableHead>
                                <TableHead className="px-3 py-5 font-medium">환율</TableHead>
                                <TableHead className="px-3 py-5 font-medium">작성일</TableHead>
                                <TableHead className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotations?.map((quotation) => (
                                <TableRow
                                    key={quotation.id}
                                    className="border-b text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <TableCell className="whitespace-nowrap px-5 py-3">{quotation.manager}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{quotation.writer}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{quotation.gWeight}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{quotation.currency}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{quotation.exchangeRate}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{formatDateToLocal(quotation.createdAt)}</TableCell>
                                    <TableCell className="whitespace-nowrap py-3 pl-6 pr-3">
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
