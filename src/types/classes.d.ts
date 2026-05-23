export type Stat = {
    name: string
    value: number
}

export type Tree = {
    name: string
    alias: string
    value: number
}

export type Class = {
    alias: string;
    name: string;
    selected: boolean;
    isArchetype: boolean;
    weightedStats: Array<Stat>;
    enhancementTrees: Array<Tree>;
    baseClass?: string;
}

export type ChosenClass = Omit<Class, 'selected' | 'isArchetype'> & { levels: number }

export type Classes = {
    free: Class[],
    premium: Class[],
    archetype: Class[],
}