export type UniversalTree = {
    alias: string;
    name: string;
    selected: boolean;
    className?: string;
}

export type ChosenUniversalTree = Omit<UniversalTree, "selected"> & {
    value: number;
    weight: number;
    levels: number;
}