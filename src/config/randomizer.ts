import { BaseStats } from "@/types/races";

export let enhancementPoints = 80;
export let destinyPoints = 60;

export const minRacialPoints = 0;
export const maxRacialPoints = 14;

export const maxLevel = 34;

export const minDestinyPointsCalc = 12 + 40 + ((maxLevel - 30) * 4);
export const maxDestinyPointsCalc = 12 + 40 + ((maxLevel - 30) * 4) + 14;

export const baseStats : Array<BaseStats> = [
    {name: 'STR', value: 8, weight: 1},
    {name: 'DEX', value: 8, weight: 1},
    {name: 'CON', value: 8, weight: 1},
    {name: 'INT', value: 8, weight: 1},
    {name: 'WIS', value: 8, weight: 1},
    {name: 'CHA', value: 8, weight: 1},
];
