export type Stat = {
    name: string,
    value: number,
}

export type BaseStats = Stat & {
    weight: number
}

export type Race = {
    alias: string;
    name: string;
    selected: boolean;
    statsMod?: { increasedStats: Stat[], loweredStats?: Stat[] };
    forcedClass?: string
    forcedClassName?: string
    isIconic: boolean
}

export type Races = {
    free: Race[],
    premium: Race[],
    iconic: Race[]
}