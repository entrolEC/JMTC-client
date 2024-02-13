import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Port } from ".prisma/client";
import { DeletePort, UpdatePort } from "@/app/ui/ports/buttons";

export default function PortsTable({ ports }: { ports: Port[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-[120px]">코드</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead className="text-right">
                        <span className="sr-only">Edit</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ports?.map((port) => (
                    <TableRow key={port.id}>
                        <TableCell className="font-bold">{port.code}</TableCell>
                        <TableCell>{port.name}</TableCell>
                        <TableCell>{port.description}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-3">
                                <UpdatePort id={port.id} />
                                <DeletePort id={port.id} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
