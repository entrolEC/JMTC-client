import { Quote } from "@prisma/client";
import { DeleteItem, UpdateItem } from "@/app/ui/items/buttons";
import { DeleteQuotation, UpdateQuotation } from "@/app/ui/quotations/buttons";
import { formatDateToLocal } from "@/app/lib/utils";

export default function QuotationsTable({ quotations }: { quotations: Quote[] }) {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {quotations?.map((quotation) => (
                            <div key={quotation.id} className="mb-2 w-full rounded-md bg-white p-4">
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">{quotation.manager}</p>
                                        <p>{quotation.writer}</p>
                                        <p>{quotation.gWeight}</p>
                                        <p>{formatDateToLocal(quotation.createdAt)}</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <UpdateItem id={quotation.id} />
                                        <DeleteItem id={quotation.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    담당자
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    작성자
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    g.weight
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    작성일
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {quotations?.map((quotation) => (
                                <tr
                                    key={quotation.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap px-5 py-3">{quotation.manager}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{quotation.writer}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{quotation.gWeight}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(quotation.createdAt)}</td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateQuotation id={quotation.id} />
                                            <DeleteQuotation id={quotation.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
