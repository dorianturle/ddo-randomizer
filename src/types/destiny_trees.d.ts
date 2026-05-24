export type DestinyTree = {
    name: string
    alias: string
    core: boolean,
    isBought?: boolean,
    upcoming: boolean,
}

export type ChosenDestinyTree = DestinyTree & {
    value: number;
    weight: number;
}