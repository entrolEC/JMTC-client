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
                                <TableHead className="px-4 py-5 font-medium sm:pl-6">코드</TableHead>
                                <TableHead className="px-3 py-5 font-medium">이름</TableHead>
                                <TableHead className="px-3 py-5 font-medium">생성일</TableHead>
                                <TableHead className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items?.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="border-b text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <TableCell className="whitespace-nowrap px-5 py-3">{item.code}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{item.name}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{formatDateToLocal(item.createdAt)}</TableCell>
                                    <TableCell className="whitespace-nowrap py-3 pl-6 pr-3">
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
