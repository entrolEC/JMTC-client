import { Item } from "@prisma/client";
import { DeleteItem, UpdateItem } from "@/app/ui/items/buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ItemsTable({ items }: { items: Item[] }) {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>코드</TableHead>
                                <TableHead className="min-w-[120px]">이름</TableHead>
                                <TableHead>U/T</TableHead>
                                <TableHead>value</TableHead>
                                <TableHead>VAT</TableHead>
                                <TableHead className="text-right">생성일</TableHead>
                                <TableHead className="text-right">
                                    <span className="sr-only">Edit</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-bold">{item.code}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.unitType}</TableCell>
                                    <TableCell>{item.value}</TableCell>
                                    <TableCell>{item.vat.toString()}</TableCell>
                                    <TableCell className="text-right">{formatDateToLocal(item.createdAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-3">
                                            <UpdateItem id={item.id} />
                                            <DeleteItem id={item.id} />
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
