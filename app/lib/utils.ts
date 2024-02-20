import { Revenue } from "./definitions";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
};

export const formatDateToLocal = (date: Date, locale: string = "ko-KR") => {
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
    // Calculate what labels we need to display on the y-axis
    // based on highest record and in 1000s
    const yAxisLabels = [];
    const highestRecord = Math.max(...revenue.map((month) => month.revenue));
    const topLabel = Math.ceil(highestRecord / 1000) * 1000;

    for (let i = topLabel; i >= 0; i -= 1000) {
        yAxisLabels.push(`$${i / 1000}K`);
    }

    return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
        return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function multiply(a: number, b: number) {
    var factor = Math.pow(10, numberOfDecimalPlaces(a, b));
    return (a * factor * (b * factor)) / (factor * factor);
}

function numberOfDecimalPlaces(...args: number[]) {
    return Math.max(...args.map((arg) => (arg.toString().split(".")[1] || "").length));
}

const OCEAN_CBM_WEIGHT = 1000;
const AIR_CBM_WEIGHT = 167;
export function calculateValue(mode: string, value: number, grossWeight: number) {
    const str = mode.toUpperCase();
    if (str.includes("AIR")) {
        if (multiply(value, AIR_CBM_WEIGHT) < grossWeight) {
            return grossWeight;
        } else {
            return Math.round(value * AIR_CBM_WEIGHT * 100) / 100;
        }
    } else if (str.includes("OCN") || str.includes("OCEAN")) {
        if (multiply(value, OCEAN_CBM_WEIGHT) < grossWeight) {
            return grossWeight / OCEAN_CBM_WEIGHT;
        } else {
            return value;
        }
    }
}
