import { QuoteItem } from "@prisma/client";
import { DeleteQuotationItem, UpdateQuotationItem } from "@/app/ui/quotations/items/buttons";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function QuotationItemsTable({ quotationItems }: { quotationItems: QuoteItem[] }) {
    const total = quotationItems.reduce((acc, curr) => acc + curr.amount, 0);
    const formattedTotal = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>코드</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>
                        <span className="sr-only">Edit</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quotationItems?.map((quotationItem) => (
                    <TableRow key={quotationItem.id}>
                        <TableCell>{quotationItem.code}</TableCell>
                        <TableCell>{quotationItem.name}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-3">
                                <UpdateQuotationItem quotationId={quotationItem.quote_id} id={quotationItem.id} />
                                <DeleteQuotationItem quotationId={quotationItem.quote_id} id={quotationItem.id} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right">{formattedTotal}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
