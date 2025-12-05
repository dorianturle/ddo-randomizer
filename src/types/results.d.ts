import type { Classes as ClassesType } from "./classes"
import type { Stat as StatType } from "./stats"
import type { UniversalTree as UniversalTreeType } from "./universal_trees"

export type Results = {
    race: string;
    alignment: string;
    classes: Array<ClassesType>;
    stats: Array<StatType>;
    enhancement_trees: {
        open: boolean;
        trees: Array<UniversalTreeType>;
    }
}