import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ctnr } from ".prisma/client";
import { DeleteCtnr, Updatectnr } from "@/app/ui/ctnrs/buttons";

export default function CtnrsTable({ ctnrs }: { ctnrs: Ctnr[] }) {
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
                {ctnrs?.map((ctnr) => (
                    <TableRow key={ctnr.id}>
                        <TableCell className="font-bold">{ctnr.code}</TableCell>
                        <TableCell>{ctnr.name}</TableCell>
                        <TableCell>{ctnr.description}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-3">
                                <Updatectnr id={ctnr.id} />
                                <DeleteCtnr id={ctnr.id} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
