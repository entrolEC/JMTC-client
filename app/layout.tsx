import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: {
        template: "%s | JMTC Dashboard",
        default: "JMTC Dashboard",
    },
    description: "견적서 관리 프로그램",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className={`${inter.className} antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
