import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteIncoterm, UpdateIncoterm } from "@/app/ui/incoterms/buttons";
import { Currency } from "@prisma/client";

export default function CurrenciesTable({ currencies }: { currencies: Currency[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-[120px]">코드</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead className="text-right">
                        <span className="sr-only">Edit</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {currencies?.map((currency) => (
                    <TableRow key={currency.id}>
                        <TableCell className="font-bold">{currency.code}</TableCell>
                        <TableCell>{currency.name}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-3">
                                <UpdateIncoterm id={currency.id} />
                                <DeleteIncoterm id={currency.id} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
