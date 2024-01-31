"use client";

import { MouseEventHandler, ReactNode, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
    children: ReactNode;
};

export default function Modal({ children }: Props) {
    const router = useRouter();
    const overlay = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    const onClick: MouseEventHandler = useCallback(
        (e) => {
            if (e.target === overlay.current || e.target === wrapper.current) {
                if (onDismiss) onDismiss();
            }
        },
        [onDismiss, overlay, wrapper],
    );

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onDismiss();
        },
        [onDismiss],
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <div ref={overlay} className="fixed z-10 left-0 rounded-3xl right-0 top-0 bottom-0 mx-auto bg-black/60" onClick={onClick}>
            <div ref={wrapper} className="absolute rounded-3xl bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-7xl p-8">
                {children}
            </div>
        </div>
    );
}
