"use client";

import {
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
    DocumentDuplicateIcon,
    DocumentIcon,
    HomeIcon,
    MapPinIcon,
    RectangleStackIcon,
    TruckIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: DocumentDuplicateIcon,
    },
    { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
    {
        name: "Items",
        href: "/dashboard/items",
        icon: DocumentIcon,
    },
    {
        name: "Quotations",
        href: "/dashboard/quotations",
        icon: ClipboardDocumentListIcon,
    },
    {
        name: "Ports",
        href: "/dashboard/ports",
        icon: MapPinIcon,
    },
    {
        name: "Ctnrs",
        href: "/dashboard/ctnrs",
        icon: RectangleStackIcon,
    },
    {
        name: "Incoterms",
        href: "/dashboard/incoterms",
        icon: TruckIcon,
    },
    {
        name: "Currencies",
        href: "/dashboard/currencies",
        icon: CurrencyDollarIcon,
    },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-sky-100 text-blue-600": pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
