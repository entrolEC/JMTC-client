import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Incoterm } from ".prisma/client";
import { DeleteIncoterm, UpdateIncoterm } from "@/app/ui/incoterms/buttons";

export default function IncotermsTable({ incoterms }: { incoterms: Incoterm[] }) {
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
                {incoterms?.map((incoterm) => (
                    <TableRow key={incoterm.id}>
                        <TableCell className="font-bold">{incoterm.code}</TableCell>
                        <TableCell>{incoterm.name}</TableCell>
                        <TableCell>{incoterm.description}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-3">
                                <UpdateIncoterm id={incoterm.id} />
                                <DeleteIncoterm id={incoterm.id} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
