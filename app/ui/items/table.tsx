import { Item } from "@prisma/client";
import { DeleteItem, UpdateItem } from "@/app/ui/items/buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ItemsTable({ items }: { items: Item[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>코드</TableHead>
                    <TableHead className="min-w-[120px]">이름</TableHead>
                    <TableHead>U/T</TableHead>
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
                        <TableCell>
                            {item.vat ? (
                                <CheckIcon className="w-6" color="green" strokeWidth={3} />
                            ) : (
                                <XMarkIcon className="w-6" color="red" strokeWidth={3} />
                            )}
                        </TableCell>
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
    );
}
