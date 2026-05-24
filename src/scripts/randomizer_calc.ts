import type {BaseStats, Race, Races as RacesType} from "@/types/races";
import {ChosenClass, Class, Classes as ClassesType, Stat, Tree} from "@/types/classes";
import type {Alignment, Alignment as AlignmentType} from "@/types/alignments";
import type {AbilityPoints as AbilityPointsType} from "@/types/ability_points";
import {ChosenUniversalTree, UniversalTree as UniversalTreeType} from "@/types/universal_trees";
import {ChosenDestinyTree, DestinyTree as DestinyTreeType} from "@/types/destiny_trees";
import type {RandomizerOptions as RandomizerOptionsType} from "@/types/randomizer_options";
import type {Results as ResultsType} from "@/types/results";

import { filterSelected } from "@/utils/randomizer";
import {baseStats, enhancementPoints} from "@/config/randomizer";

function groupBy(xs: any, key: any) {
    return xs.reduce((rv: any, x: any) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

function initCAR(classes: Array<Class>, alignment: Array<Alignment>, race: Array<Race>): [Array<Class>, Array<Alignment>, Array<Race>] {
    return [JSON.parse(JSON.stringify(classes)), JSON.parse(JSON.stringify(alignment)), JSON.parse(JSON.stringify(race))]
}

function filterClassesByAlignment(alignment: String, classes: Array<Class>) : Array<Class> {
    switch (alignment) {
        case "lawful_good": classes =  classes.filter((_class: Class) => !["bard", "stormsinger", "barbarian", "druid", "blight_caster", "acolyte_of_the_skin"].includes(_class.alias)); break ;
        case "lawful_neutral": classes = classes.filter((_class: Class) => !["bard", "stormsinger", "barbarian", "paladin", "sacred_fist"].includes(_class.alias)); break ;
        case "neutral_good": classes = classes.filter((_class: Class) => !["monk", "paladin", "sacred_fist", "acolyte_of_the_skin"].includes(_class.alias)); break ;
        case "chaotic_good": classes = classes.filter((_class: Class) => !["monk", "paladin", "sacred_fist", "druid", "blight_caster", "acolyte_of_the_skin"].includes(_class.alias)); break ;
        default: classes = classes.filter((_class: Class) => !["monk", "paladin", "sacred_fist"].includes(_class.alias)); break ;
    }

    return classes;
}

// paladins/sacred fist cant multiclass with : bard, barbarian, druid, and acolyte of the skin
// monks cant multiclass with : bard, barbarian
function filterClassesByMulticlass(class_alias: String, classes: Array<Class>) : Array<Class> {
    switch (class_alias) {
        case "bard": case "stormsinger": case "barbarian": classes =  classes.filter((_class: Class) => !["paladin", "sacred_fist", "monk"].includes(_class.alias)); break ;
        case "druid": case "blight_caster": case "acolyte_of_the_skin": classes = classes.filter((_class: Class) => !["paladin", "sacred_fist"].includes(_class.alias)); break ;
        case "paladin": case "sacred_fist": classes = classes.filter((_class: Class) => !["bard", "barbarian", "druid", "acolyte_of_the_skin"].includes(_class.alias)); break ;
        case "monk": classes = classes.filter((_class: Class) => !["bard", "barbarian"].includes(_class.alias)); break ;
        default: break ;
    }

    return classes;
}

function rollClasses(chosenClasses: ChosenClass[], chosenRace:Race, classesSelectedCopy: Class[], randomizerOptions: RandomizerOptionsType): ChosenClass[] {
    let numberClasses: number;
    // if we need a class capstone, we force 20 levels in a unique class
    if (randomizerOptions.enhancement.capstone === "class_capstone") {
        numberClasses = 1;
    } else {
        const numberMulticlass = Object.keys(randomizerOptions.multiclass).filter((key: string) => randomizerOptions.multiclass[key])
        numberClasses = Math.min(numberMulticlass.length > 0 ? parseInt(numberMulticlass[Math.floor(Math.random()*numberMulticlass.length)]) : Math.floor(Math.random() * Object.keys(randomizerOptions.multiclass).length + 1), classesSelectedCopy.length)
    }

    let enhancementTrees: Tree[] = [];
    let weightedStats: Stat[] = [];
    let totalRemainingLevels = 20;
    let name: string = '';
    let levels: number, alias : string;

    for (let i = 1; i <= numberClasses; i++) {
        if (classesSelectedCopy.length === 0) {
            // If no class is available due to filtering, ensure the last chosen class gets all remaining levels
            if (chosenClasses.length > 0 && totalRemainingLevels > 0) {
                chosenClasses[chosenClasses.length - 1].levels += totalRemainingLevels;
                totalRemainingLevels = 0;
            }
            break;
        }

        if (i === 1 && chosenRace?.forcedClass && chosenRace.forcedClass.length > 0) {
            alias = chosenRace.forcedClass;
            const forcedClass : Class | undefined = classesSelectedCopy.find(_class => _class.alias === alias);

            if (forcedClass) {
                name = chosenRace.forcedClassName ? chosenRace.forcedClassName : '';
                weightedStats = forcedClass.weightedStats;
                enhancementTrees = forcedClass.enhancementTrees;
            }
        } else {
            const classIdx = Math.floor(Math.random() * classesSelectedCopy.length);
            alias = classesSelectedCopy[classIdx].alias;

            name = classesSelectedCopy[classIdx].name;
            weightedStats = classesSelectedCopy[classIdx].weightedStats
            enhancementTrees = classesSelectedCopy[classIdx].enhancementTrees;
        }

        const selectedClass = classesSelectedCopy.find(_class => _class.alias === alias);

        // If an archetype is selected, remove its base class and other archetypes of the same base
        if (selectedClass?.baseClass) {
            const baseClassAlias = selectedClass.baseClass;
            classesSelectedCopy = classesSelectedCopy.filter(function(_class) {
                return _class.alias !== baseClassAlias && _class.baseClass !== baseClassAlias;
            });
        }

        // archetypes can't be the core class
        classesSelectedCopy = classesSelectedCopy.filter(function(_class) {
            return _class.baseClass !== alias;
        });

        classesSelectedCopy = filterClassesByMulticlass(alias, classesSelectedCopy);

        if (i > 1) {
            // if this is the last level, we dump all the remaining levels
            if (i === numberClasses || classesSelectedCopy.length === 0) {
                levels = totalRemainingLevels;
            } else {
                levels = Math.floor(Math.random() * (totalRemainingLevels - (numberClasses - i + 1)) + 1);
            }
        } else if (numberClasses === 1 || classesSelectedCopy.length === 0) {
            levels = 20;
        } else {
            levels = Math.floor(Math.random() * ((totalRemainingLevels - numberClasses) - 1 + 1) + 1);
        }

        totalRemainingLevels -= levels;
        chosenClasses[i - 1] = {
            alias,
            name,
            levels,
            weightedStats,
            enhancementTrees
        }

        classesSelectedCopy = classesSelectedCopy.filter( _class => _class.alias !== alias)
    }

    return chosenClasses.sort((a,b) => b.levels - a.levels)
}

function rollStats(chosenStats: BaseStats[], stats: AbilityPointsType[], chosenRace: Race, chosenClasses: ChosenClass[], randomizerOptions: RandomizerOptionsType): BaseStats[] {
    let startingAbilityPoints : AbilityPointsType = stats.filter(stat => stat.selected)[0];
    let finalStartStats: number = 28
    if (chosenRace.name === 'drow' && startingAbilityPoints.name !== '28') {
        finalStartStats = parseInt(startingAbilityPoints.name) - 4;
    } else if (chosenRace.isIconic && startingAbilityPoints.name === '28') {
        finalStartStats = 32
    }

    // if weighted, add it to the base weight
    if (randomizerOptions.ability_score_weight !== 'no_weight') {
        chosenClasses.forEach((_class, idx) => {
            if ((randomizerOptions.ability_score_weight === 'weight_main' && idx === 0) || randomizerOptions.ability_score_weight === 'weight_all') {
                if (_class.weightedStats) {
                    _class.weightedStats.forEach(stat => {
                        const statIndex = chosenStats.findIndex(baseStat => baseStat.name === stat.name)
                        chosenStats[statIndex].weight += (stat.value - 1)
                    })
                }
            }
        })
    }

    let cumulativeWeights : Array<number> = [];
    for (let i = 0; i < chosenStats.length; i += 1) {
        cumulativeWeights[i] = chosenStats[i].weight + (cumulativeWeights[i - 1] || 0);
    }
    let maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];

    // allocate stat points
    for (let pts = 1; pts <= finalStartStats; pts++) {
        let randomNumber = maxCumulativeWeight * Math.random();

        let ability;

        // apply weight
        for (let itemIndex = 0; itemIndex < chosenStats.length; itemIndex++) {
            if (chosenStats[itemIndex].value === 18) {
                chosenStats[itemIndex].weight = 0;

                //recalculate weights
                for (let i = 0; i < chosenStats.length; i += 1) {
                    cumulativeWeights[i] = chosenStats[i].weight + (cumulativeWeights[i - 1] || 0);
                }
                maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
                randomNumber = maxCumulativeWeight * Math.random();

                continue;
            }

            if (cumulativeWeights[itemIndex] >= randomNumber) {
                ability = chosenStats[itemIndex].value
                if (ability === 14 || ability === 15) {
                    if ((finalStartStats - pts) < 2) {
                        if (itemIndex === chosenStats.length - 1) {
                            pts--;
                        }
                        continue;
                    }
                    pts += 1; // costs 2 total
                } else if (ability >= 16) {
                    if (finalStartStats - pts < 3) {
                        if (itemIndex === chosenStats.length - 1) {
                            pts--;
                        }
                        continue;
                    }
                    pts += 2; // costs 3 total
                }

                chosenStats[itemIndex].value++;
                break;
            }
        }
    }

    if (chosenRace.statsMod) {
        Object.entries(chosenRace.statsMod).forEach(([idx, changes]) => {
            changes.forEach(incr => {
                chosenStats[chosenStats.findIndex(stat => stat.name === incr.name)].value += idx === "increasedStats" ? incr.value : -incr.value
            })
        });
    }

    return chosenStats;
}

function rollUniversalTrees(chosenEnhancementTrees: ChosenUniversalTree[], chosenRace: Race, chosenClasses: ChosenClass[], universalTrees: UniversalTreeType[], randomizerOptions: RandomizerOptionsType): ChosenUniversalTree[] {
    const universalTreeCopy = filterSelected<UniversalTreeType>(universalTrees)
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value)
        .slice(0, Math.floor(Math.random() * (3 - 1 + 1) + 1));

    let capstone_class_tree_idx = -1, capstone_universal_tree_idx = -1;
    if (randomizerOptions.enhancement.capstone === "class_capstone") {
        capstone_class_tree_idx = Math.floor(Math.random() * 3)
    } else if (randomizerOptions.enhancement.capstone === "universal_capstone") {
        capstone_universal_tree_idx = Math.floor(Math.random() * (universalTreeCopy.length - 1 + 1))
    }

    chosenEnhancementTrees =
        chosenClasses
            .flatMap((_class, idx) => {
                if (!_class.enhancementTrees) { return [] }

                _class.enhancementTrees
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)

                // because sorcerer has tree restrictions, we have to randomly remove one for each set of opposites before the weight calc
                if (_class.alias === 'sorcerer') {
                    for (let itemIndex = 0; itemIndex < _class.enhancementTrees.length; itemIndex++) {
                        switch (_class.enhancementTrees[itemIndex].alias) {
                            case "fire_savant":
                                _class.enhancementTrees = _class.enhancementTrees.filter(tree=> !["water_savant"].includes(tree.alias))
                                break;
                            case "water_savant":
                                _class.enhancementTrees = _class.enhancementTrees.filter(tree=> !["fire_savant"].includes(tree.alias))
                                break;
                            case "earth_savant":
                                _class.enhancementTrees = _class.enhancementTrees.filter(tree=> !["air_savant"].includes(tree.alias));
                                break;
                            case "air_savant":
                                _class.enhancementTrees = _class.enhancementTrees.filter(tree=> !["earth_savant"].includes(tree.alias))
                                break;

                            default:
                                break;
                        }
                    }
                }

                return _class.enhancementTrees.map((tree, treeIndex) => {
                    return {
                        ...tree,
                        className: _class.name,
                        levels: _class.levels,
                        weight: (capstone_class_tree_idx === treeIndex) ? 666 : (chosenClasses.length - idx + ((treeIndex + 1) * Math.floor(_class.levels / 0.90)))
                    }
                })
            })
            // remove duplicates
            .filter((tree, idx, self) => idx === self.findIndex(t => t.alias === tree.alias));

    chosenEnhancementTrees.unshift({ name: chosenRace.name, alias: "racial", className: "Racial", levels: 20, value: randomizerOptions.enhancement.racial_points, weight: Math.floor(Math.random() * 20) })

    chosenEnhancementTrees.unshift(
        ...[
            ...universalTreeCopy
                .map((universal_tree, idx) => ({
                    ...universal_tree,
                    className: "Universal",
                    levels: 20,
                    value: 0,
                    weight: capstone_universal_tree_idx === idx ? 666 : Math.floor(Math.random() * 20) + 1 + idx
                })),
        ]
    )

    let copyEnhancementTrees: ChosenUniversalTree[] = [];
    let cumulativeTreeWeights: number[] = []
    let maxEnhancementTreeValue = 41 + Math.floor(Math.random() * 4 + 1) // 42 to 45 in a single tree

    do {
        copyEnhancementTrees = JSON.parse(JSON.stringify(chosenEnhancementTrees));
        // calculate total tree weight
        cumulativeTreeWeights = [];
        for (let i = 0; i < copyEnhancementTrees.length; i += 1) {
            cumulativeTreeWeights[i] = copyEnhancementTrees[i].weight + (cumulativeTreeWeights[i - 1] || 0);
        }
        let maxCumulativeTreeWeight = cumulativeTreeWeights[cumulativeTreeWeights.length - 1];

        let attributed, picked_trees : any = [], randomNumber;
        for (let pts = 1; pts <= enhancementPoints; pts++) {
            attributed = false;
            randomNumber = maxCumulativeTreeWeight * Math.random();

            // apply weight
            for (let itemIndex = 0; itemIndex < copyEnhancementTrees.length; itemIndex++) {
                if (picked_trees.length === 6 && copyEnhancementTrees[itemIndex].alias !== "racial" && !picked_trees.includes(copyEnhancementTrees[itemIndex].alias)) {
                    continue;
                }

                if (
                    (copyEnhancementTrees[itemIndex].value >= maxEnhancementTreeValue)
                    || (copyEnhancementTrees[itemIndex].value >= 10 && copyEnhancementTrees[itemIndex].levels <= 2)
                    || (copyEnhancementTrees[itemIndex].value >= 20 && copyEnhancementTrees[itemIndex].levels <= 4)
                ) {
                    //recalculate weights
                    copyEnhancementTrees[itemIndex].weight = 0;
                    cumulativeTreeWeights = [];
                    for (let i = 0; i < copyEnhancementTrees.length; i += 1) {
                        cumulativeTreeWeights[i] = copyEnhancementTrees[i].weight + (cumulativeTreeWeights[i - 1] || 0);
                    }
                    maxCumulativeTreeWeight = cumulativeTreeWeights[cumulativeTreeWeights.length - 1];
                    randomNumber = maxCumulativeTreeWeight * Math.random();

                    continue;
                }

                if (cumulativeTreeWeights[itemIndex] >= randomNumber) {
                    copyEnhancementTrees[itemIndex].value++;
                    attributed = true;

                    if(copyEnhancementTrees[itemIndex].alias !== "racial" && !picked_trees.includes(copyEnhancementTrees[itemIndex].alias)) {
                        picked_trees.push(copyEnhancementTrees[itemIndex].alias);
                    }
                    break;
                }
            }

            if (attributed === false) {
                pts--;
            }
        }
    } while (randomizerOptions.enhancement.capstone !== "no_capstone" && !copyEnhancementTrees.some((ce: ChosenUniversalTree) => ce.value === maxEnhancementTreeValue))

    return copyEnhancementTrees.filter((ct: any) => ct.value !== 0 || ct.alias === "racial").sort((a: any, b: any) => b.value - a.value)
}

function rollDestinyTrees(chosenDestinyTrees: ChosenDestinyTree[], destinyTrees: DestinyTreeType[], randomizerOptions: RandomizerOptionsType) {
    let tier5_destiny_tree_idx : number = -1;
    if (randomizerOptions.destiny.tier5 === "with_tier5") {
        tier5_destiny_tree_idx = Math.floor(Math.random() * 3)
    }

    chosenDestinyTrees = filterSelected<DestinyTreeType>(destinyTrees)
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value)
        .slice(0, 3)
        .flatMap((ut, idx) => ({
            ...ut,
            value: 0,
            weight: tier5_destiny_tree_idx === idx ? 666 : 1 + idx / 2
        }));


    let copyDestinyTrees: ChosenDestinyTree[] = [];
    let cumulativeTreeWeights : number[] = [];
    let maxDestinyTreeValue = 31 + Math.floor(Math.random() * 6 + 1) // 32 to 37 in a single tree

    do {
        copyDestinyTrees = JSON.parse(JSON.stringify(chosenDestinyTrees));
        // calculate total tree weight
        cumulativeTreeWeights = [];
        for (let i = 0; i < copyDestinyTrees.length; i += 1) {
            cumulativeTreeWeights[i] = copyDestinyTrees[i].weight + (cumulativeTreeWeights[i - 1] || 0);
        }
        let maxCumulativeTreeWeight = cumulativeTreeWeights[cumulativeTreeWeights.length - 1];

        let attributed, picked_trees : any = [], randomNumber;
        for (let pts = 1; pts <= randomizerOptions.destiny.destiny_points; pts++) {
            attributed = false;
            randomNumber = maxCumulativeTreeWeight * Math.random();

            // apply weight
            for (let itemIndex = 0; itemIndex < copyDestinyTrees.length; itemIndex++) {
                if (picked_trees.length === 6 && copyDestinyTrees[itemIndex].alias !== "racial" && !picked_trees.includes(copyDestinyTrees[itemIndex].alias)) {
                    continue;
                }

                if (copyDestinyTrees[itemIndex].value >= maxDestinyTreeValue) {
                    //recalculate weights
                    copyDestinyTrees[itemIndex].weight = 0;
                    cumulativeTreeWeights = [];
                    for (let i = 0; i < copyDestinyTrees.length; i += 1) {
                        cumulativeTreeWeights[i] = copyDestinyTrees[i].weight + (cumulativeTreeWeights[i - 1] || 0);
                    }
                    maxCumulativeTreeWeight = cumulativeTreeWeights[cumulativeTreeWeights.length - 1];
                    randomNumber = maxCumulativeTreeWeight * Math.random();

                    continue;
                }

                if (cumulativeTreeWeights[itemIndex] >= randomNumber) {
                    copyDestinyTrees[itemIndex].value++;
                    attributed = true;

                    if(copyDestinyTrees[itemIndex].alias !== "racial" && !picked_trees.includes(copyDestinyTrees[itemIndex].alias)) {
                        picked_trees.push(copyDestinyTrees[itemIndex].alias);
                    }
                    break;
                }
            }

            if (attributed === false) {
                pts--;
            }
        }
    } while (randomizerOptions.destiny.tier5 === "with_tier5" && !copyDestinyTrees.some((ce: any) => ce.value === maxDestinyTreeValue))

    return copyDestinyTrees.filter((ct: any) => ct.value !== 0).sort((a: any, b: any) => b.value - a.value);
}

export function randomize(
    results: ResultsType[],
    races: RacesType,
    classes: ClassesType,
    alignments: Array<AlignmentType>,
    abilityPoints: Array<AbilityPointsType>,
    universalTrees: Array<UniversalTreeType>,
    destinyTrees: Array<DestinyTreeType>,
    randomizerOptions: RandomizerOptionsType,
) : Array<ResultsType|any /*tmp*/> {
    let errors: Array<{message: string; show: boolean, timer: number}> = [];

    /*  Race */
    let racesSelected : Race[] = Object.values(races).flatMap((raceCategory: Race[]) => filterSelected<Race>(raceCategory));
    if (!racesSelected.length) { // if no race is selected, use all of them
        racesSelected = Object.values(races).flatMap((raceCategory: Race[]) => raceCategory);
    }

    /*  Alignment */
    let alignmentsSelected : Alignment[] = filterSelected<AlignmentType>(alignments)
    if (!alignmentsSelected.length) { // if no alignment is selected, use all of them
        alignmentsSelected = alignments;
    }

    /*  Class */
    let classesSelected : Class[] = Object.values(classes).flatMap((classCategory: Class[]) => filterSelected<Class>(classCategory));
    if (!classesSelected.length) { // if no class is selected, use all of them
        classesSelected = Object.values(classes).flatMap((classCategory: Class[]) => classCategory);
    }

    let [classesSelectedCopy, alignmentsSelectedCopy, racesSelectedCopy] = initCAR(classesSelected, alignmentsSelected, racesSelected)

    let raceIdx = Math.floor(Math.random() * racesSelectedCopy.length);
    let chosenRace : Race = racesSelectedCopy[raceIdx]

    let alignmentIdx = Math.floor(Math.random() * alignmentsSelectedCopy.length);
    let chosenAlignment : Alignment = alignmentsSelectedCopy[alignmentIdx]

    classesSelectedCopy = filterClassesByAlignment(chosenAlignment.alias, classesSelectedCopy);

    // try to find a legal combination of class/race/alignment amongst selected options, if none, display errors to user
    while (classesSelectedCopy.length === 0 || (chosenRace?.forcedClass && !classesSelectedCopy.some((_class: Class) => _class.alias === chosenRace?.forcedClass))) {
        alignmentsSelectedCopy.splice(alignmentIdx, 1);

        if (alignmentsSelectedCopy.length === 0) {
            if (!chosenRace?.forcedClass) {
                errors = [...errors, {
                    message: "No possible outcome for this configuration of class and alignment, please adjust it.",
                    show: true,
                    timer: 5
                }];
                return [];
            }

            racesSelectedCopy.splice(raceIdx, 1);
            raceIdx = Math.floor(Math.random() * racesSelectedCopy.length);
            chosenRace = racesSelectedCopy[raceIdx];

            if (!chosenRace) {
                errors = [...errors, {
                    message: "No possible outcome for this configuration of class, iconic race and alignment, please adjust it.",
                    show: true,
                    timer: 5
                }]
                return [];
            }

            [classesSelectedCopy, alignmentsSelectedCopy, ] = initCAR(classesSelected, alignmentsSelected, racesSelected)
            alignmentIdx = Math.floor(Math.random() * alignmentsSelectedCopy.length);
            chosenAlignment = alignmentsSelectedCopy[alignmentIdx];

            classesSelectedCopy = filterClassesByAlignment(chosenAlignment.alias, classesSelectedCopy);
            continue;
        }

        classesSelectedCopy = JSON.parse(JSON.stringify(classesSelected))
        alignmentIdx = Math.floor(Math.random() * alignmentsSelectedCopy.length);
        chosenAlignment = alignmentsSelectedCopy[alignmentIdx];

        classesSelectedCopy = filterClassesByAlignment(chosenAlignment.alias, classesSelectedCopy);
    }

    let chosenClasses: ChosenClass[] = rollClasses([], chosenRace, classesSelectedCopy, randomizerOptions);

    // 9-14 => 1pt ; 15-16 => 2pts ; 17-18 => 3pts. racials are applied AFTER.
    let chosenStats : BaseStats[] = rollStats(JSON.parse(JSON.stringify(baseStats)), abilityPoints, chosenRace, chosenClasses, randomizerOptions);

    let chosenEnhancementTrees : ChosenUniversalTree[] = [];

    if (randomizerOptions.enhancement.randomize) {
        chosenEnhancementTrees = rollUniversalTrees(chosenEnhancementTrees, chosenRace, chosenClasses, universalTrees, randomizerOptions);
    }

    let chosenDestinyTrees : ChosenDestinyTree[] = [];

    if (randomizerOptions.destiny.randomize) {
        chosenDestinyTrees = rollDestinyTrees(chosenDestinyTrees, destinyTrees, randomizerOptions);
    }

    results = [{
        race: chosenRace.name,
        alignment: chosenAlignment.name,
        classes: chosenClasses,
        stats: chosenStats,
        enhancement_trees: groupBy(chosenEnhancementTrees, 'className'),
        destiny_trees: chosenDestinyTrees,
    }, ...results]

    return results;
}