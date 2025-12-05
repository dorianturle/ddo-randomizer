import type {Race, Races as RacesType} from "@/types/races"
import type {Classes as ClassesType} from "@/types/classes"
import type {Alignment as AlignmentType} from "@/types/alignments"
import type {Stat as StatType} from "@/types/stats"
import type {UniversalTree as UniversalTreeType} from "@/types/universal_trees"
import type {DestinyTree as DestinyTreeType} from "@/types/destiny_trees"
import type {RandomizerOptions as RandomizerOptionsType} from "@/types/randomizer_options"
import type {Results as ResultsType} from "@/types/results"

function filterSelected<T extends {selected?: boolean; isBought?: boolean}>(data: Array<T>): Array<T> {
    return JSON.parse(JSON.stringify(data)).filter((c: T) => c.selected || c.isBought || false)
}

export function isSelected<T extends {selected?: boolean; isBought?: boolean}>(data: T[]): boolean {
    //console.log(data)
    return filterSelected<T>(data).length === data.length
}

export function filterCategory<T extends {category: string}>(data: T[], category: string): Array<T> {
    return JSON.parse(JSON.stringify(data)).filter((c: T) => c.category === category)
}

/*const toggle = <T extends {selected: boolean}, >(e: ChangeEvent<HTMLInputElement>, type?: string, k?: number) => {
        let toggledClasses: [string, Array<T>][] = JSON.parse(JSON.stringify(Object.entries(races)))

        toggledClasses.forEach(( [idx, val] : [idx: string, val: Array<T>] ) : void => {
            if (type && type !== idx) return;

            return val.forEach((c: T, raceIdx: number) => {
                if (k !== undefined && k !== raceIdx) return;

                c.selected = e.target.checked
            })
        })

        editRaces(Object.fromEntries(toggledClasses) as Races)
    } */

export function randomize(
    races: RacesType,
    classes: ClassesType,
    alignments: Array<AlignmentType>,
    stats: Array<StatType>,
    universalTrees: Array<UniversalTreeType>,
    destinyTrees: Array<DestinyTreeType>,
    randomizerOptions: RandomizerOptionsType,
) : Array<ResultsType> {
    let racesSelected = Object.values(races).flatMap((raceCategory: Race[]) => filterSelected<Race>(raceCategory));

    if (!racesSelected.length) {
        racesSelected = Object.values(races).flatMap((raceCategory: Race[]) => raceCategory);
    }

    let classesSelected = [];

    let alignmentSelected = filterSelected<AlignmentType>(alignments)

    if (!alignmentSelected.length) {
        alignmentSelected = alignments;
    }

    const alignmentIdx = Math.floor(Math.random() * alignmentSelected.length)

    console.log(alignmentIdx)

    /*console.log(races);
    console.log(classes);
    console.log(alignments);
    console.log(stats);
    console.log(universalTrees);
    console.log(destinyTrees);
    console.log(randomizerOptions);*/
    return [];
}