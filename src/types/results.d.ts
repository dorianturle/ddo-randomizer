import type { ChosenClass } from "./classes"
import type { BaseStats } from "./races"
import type { ChosenUniversalTree } from "./universal_trees"
import type {ChosenDestinyTree} from "./destiny_trees";

export type Results = {
    race: string;
    alignment: string;
    classes: Array<ChosenClass>;
    stats: Array<BaseStats>;
    enhancement_trees: Array<ChosenUniversalTree[]>,
    destiny_trees: Array<ChosenDestinyTree>
}
