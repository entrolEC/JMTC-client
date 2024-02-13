import { ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return <Suspense fallback={<div className="container mx-auto my-10" />}>{children}</Suspense>;
}
