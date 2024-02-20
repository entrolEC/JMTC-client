import { multiply } from "@/app/lib/utils";

const OCEAN_CBM_WEIGHT = 1000;
const AIR_CBM_WEIGHT = 167;

function isModeAir(mode: string) {
    const str = mode.toUpperCase();
    return str.includes("AIR");
}
export function calculateValue(mode: string, value: number, grossWeight: number) {
    if (isModeAir(mode)) {
        if (multiply(value, AIR_CBM_WEIGHT) < grossWeight) {
            return grossWeight;
        } else {
            return Math.round(value * AIR_CBM_WEIGHT * 100) / 100;
        }
    } else {
        if (multiply(value, OCEAN_CBM_WEIGHT) < grossWeight) {
            return grossWeight / OCEAN_CBM_WEIGHT;
        } else {
            return value;
        }
    }
}

export function getValueForUnitType(unitType: string, calculatedValue: number | undefined) {
    if (unitType === "BL") {
        return 1;
    } else {
        return calculatedValue ?? 0;
    }
}

const unitTypeForCodeAIR: { [code: string]: string } = {
    THC: "KG",
    WHC: "KG",
};

const unitTypeForCodeOCN: { [code: string]: string } = {
    THC: "CBM",
    WHC: "CBM",
};
export function getDefaultUnitType(code: string, mode: string) {
    if (isModeAir(mode)) {
        return unitTypeForCodeAIR[code];
    } else {
        return unitTypeForCodeOCN[code];
    }
}
