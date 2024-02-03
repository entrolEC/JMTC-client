import { QuoteItem } from "@prisma/client";
import { DeleteQuotationItem, UpdateQuotationItem } from "@/app/ui/quotations/items/buttons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function QuotationItemsTable({ quotationItems }: { quotationItems: QuoteItem[] }) {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-5 font-medium sm:pl-6">코드</TableHead>
                                <TableHead className="px-3 py-5 font-medium">이름</TableHead>
                                <TableHead className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotationItems?.map((quotationItem) => (
                                <TableRow
                                    key={quotationItem.id}
                                    className="border-b text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <TableCell className="whitespace-nowrap px-5 py-3">{quotationItem.code}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{quotationItem.name}</TableCell>
                                    <TableCell className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateQuotationItem quotationId={quotationItem.quote_id} id={quotationItem.id} />
                                            <DeleteQuotationItem quotationId={quotationItem.quote_id} id={quotationItem.id} />
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
