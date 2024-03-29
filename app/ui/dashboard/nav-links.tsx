"use client";

import { ClipboardDocumentListIcon, CurrencyDollarIcon, DocumentIcon, MapPinIcon, RectangleStackIcon, TruckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect } from "react"; // Map of links to display in the side navigation.

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    {
        name: "Quotations",
        href: "/dashboard/quotations",
        icon: ClipboardDocumentListIcon,
    },
    {
        name: "Items",
        href: "/dashboard/items",
        icon: DocumentIcon,
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
    const router = useRouter();

    useEffect(() => {
        links.forEach((link) => {
            router.prefetch(link.href);
        });
    }, [router]);

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-200 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-gray-300 text-gray-700": pathname === link.href,
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
