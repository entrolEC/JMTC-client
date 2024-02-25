import { multiply } from "@/app/lib/utils";
import { Ctnr } from ".prisma/client";

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
    if (unitType === "BL" || unitType === "SHIP") {
        return 1;
    } else {
        return calculatedValue ?? 0;
    }
}

// 유닛타입 변환이 자동으로 KG으로 변하지 않아야 하는 유닛타입 목록
const convertExcludeUnitType: string[] = ["BL", "SHIP", "20`", "40`"];

export function getDefaultUnitType(unitType: string, mode: string, ctnr: Ctnr) {
    if (ctnr.containerMode) {
        return ctnr.name;
    }
    if (convertExcludeUnitType.includes(unitType)) {
        return unitType;
    }
    if (isModeAir(mode)) {
        return "KG";
    } else {
        return "R.T";
    }
}
