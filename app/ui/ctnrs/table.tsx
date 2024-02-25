import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ctnr } from ".prisma/client";
import { DeleteCtnr, UpdateCtnr } from "@/app/ui/ctnrs/buttons";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CtnrsTable({ ctnrs }: { ctnrs: Ctnr[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-[120px]">코드</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>컨테이너 모드</TableHead>
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
                        <TableCell>
                            {ctnr.containerMode ? (
                                <CheckIcon className="w-6" color="green" strokeWidth={3} />
                            ) : (
                                <XMarkIcon className="w-6" color="red" strokeWidth={3} />
                            )}
                        </TableCell>
                        <TableCell>{ctnr.description}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-3">
                                <UpdateCtnr id={ctnr.id} />
                                <DeleteCtnr id={ctnr.id} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
