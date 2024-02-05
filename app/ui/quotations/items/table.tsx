import { QuoteItem } from "@prisma/client";
import { DeleteQuotationItem, UpdateQuotationItem } from "@/app/ui/quotations/items/buttons";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function QuotationItemsTable({ quotationItems }: { quotationItems: QuoteItem[] }) {
    const total = quotationItems.reduce((acc, curr) => acc + curr.amount + curr.vat, 0);
    const formattedTotal = new Intl.NumberFormat("ko", { style: "currency", currency: "KRW" }).format(total);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>코드</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>U/T</TableHead>
                    <TableHead>value</TableHead>
                    <TableHead>통화</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">VAT</TableHead>
                    <TableHead>
                        <span className="sr-only">Edit</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quotationItems?.map((quotationItem) => (
                    <TableRow key={quotationItem.id}>
                        <TableCell className="font-bold">{quotationItem.code}</TableCell>
                        <TableCell>{quotationItem.name}</TableCell>
                        <TableCell>{quotationItem.unitType}</TableCell>
                        <TableCell>{quotationItem.value}</TableCell>
                        <TableCell>{quotationItem.currency}</TableCell>
                        <TableCell>{quotationItem.price}</TableCell>
                        <TableCell className="font-semibold text-right">{quotationItem.amount}</TableCell>
                        <TableCell className="text-right">{quotationItem.vat}</TableCell>
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
                    <TableCell colSpan={8}>Total</TableCell>
                    <TableCell className="text-right">{formattedTotal}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
