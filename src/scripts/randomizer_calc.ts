import type {BaseStats, Race, Races as RacesType} from "@/types/races";
import {ChosenClass, Class, Classes as ClassesType, Stat, Tree} from "@/types/classes";
import type {Alignment, Alignment as AlignmentType} from "@/types/alignments";
import type {Stat as StatType} from "@/types/stats";
import type {UniversalTree as UniversalTreeType} from "@/types/universal_trees";
import type {DestinyTree as DestinyTreeType} from "@/types/destiny_trees";
import type {RandomizerOptions as RandomizerOptionsType} from "@/types/randomizer_options";
import type {Results as ResultsType} from "@/types/results";

import { filterSelected } from "@/utils/randomizer";
import {base_stats} from "@/config/randomizer";

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

function rollStats(chosenStats: BaseStats[], stats: StatType[], chosenRace: Race, chosenClasses: ChosenClass[], randomizerOptions: RandomizerOptionsType): BaseStats[] {
    let startingStats : StatType = stats.filter(stat => stat.selected)[0];
    let finalStartStats: number = 28
    if (chosenRace.name === 'drow' && startingStats.name !== '28') {
        finalStartStats = parseInt(startingStats.name) - 4;
    } else if (chosenRace.isIconic && startingStats.name === '28') {
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

export function randomize(
    races: RacesType,
    classes: ClassesType,
    alignments: Array<AlignmentType>,
    stats: Array<StatType>,
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
    let chosenStats : BaseStats[] = rollStats(JSON.parse(JSON.stringify(base_stats)), stats, chosenRace, chosenClasses, randomizerOptions);

    /*console.log(races);
    console.log(classes);
    console.log(alignments);
    console.log(stats);
    console.log(universalTrees);
    console.log(destinyTrees);
    console.log(randomizerOptions);*/
    return [alignmentIdx];
}