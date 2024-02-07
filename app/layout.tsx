import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | JMTC Dashboard",
        default: "JMTC Dashboard",
    },
    description: "The official Next.js Learn Dashboard built with App Router.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    );
}
