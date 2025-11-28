import {ChangeEvent, Dispatch, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {Checkbox, Label, Radio, TextInput, Tooltip} from "flowbite-react";
import {HiExclamationCircle} from "react-icons/hi";
import {Destiny, Enhancement, Multiclass, RandomizerOptions} from "@/types/randomizer_options";
import {minRacialPoints, maxRacialPoints, maxLevel, minDestinyPointsCalc, maxDestinyPointsCalc} from "@/data/randomizer/randomizer_options";

export default function Options({randomizerOptions, editRandomizerOptions, destinyTreesSelectedLength = 0} : {
    randomizerOptions: RandomizerOptions,
    editRandomizerOptions: Dispatch<RandomizerOptions>,
    destinyTreesSelectedLength: number
}) {
    const [timer, setTimer] = useState<number>(0)

    const toggle = (val: number|string|boolean, key1: keyof RandomizerOptions, key2?: keyof Enhancement|keyof Destiny|keyof Multiclass) => {
        let toggledRandomizerOptions: RandomizerOptions = JSON.parse(JSON.stringify(randomizerOptions));

        if(key1 === "ability_score_weight") {
            toggledRandomizerOptions[key1] = val as "no_weight" | "weight_main" | "weight_all";
        } else if(key2) {
            toggledRandomizerOptions[key1][key2] = val;
        }

        editRandomizerOptions(toggledRandomizerOptions as RandomizerOptions)
    }

    const togglePoints = (e: ChangeEvent<HTMLInputElement>, key: "enhancement"|"destiny") => {
        const minPoints = key === "enhancement" ? minRacialPoints : minDestinyPoints;
        const maxPoints = key === "enhancement" ? maxRacialPoints : maxDestinyPoints;

        window.clearTimeout(timer);

        const newTimer = window.setTimeout(() => {
            if (e.target.value === '') {
                e.target.value = '0'
            } else if (parseInt(e.target.value) < minPoints) {
                e.target.value = minPoints.toString();
            } else if (parseInt(e.target.value) > maxPoints) {
                e.target.value = maxPoints.toString();
            }

            toggle(parseInt(e.target.value), key, key === "enhancement" ? "racial_points" : "destiny_points")
        }, 500)

        setTimer(newTimer)
    }

    const minDestinyPoints: number = minDestinyPointsCalc + destinyTreesSelectedLength;
    const maxDestinyPoints: number = maxDestinyPointsCalc + destinyTreesSelectedLength;

    useEffect(() => {
        if (randomizerOptions.destiny.destiny_points < minDestinyPoints) {
            toggle(minDestinyPoints, "destiny", "destiny_points");
            (document.getElementById("destiny_pts") as HTMLInputElement).value = minDestinyPoints.toString()
        } else if (randomizerOptions.destiny.destiny_points > maxDestinyPoints) {
            toggle(maxDestinyPoints, "destiny", "destiny_points");
            (document.getElementById("destiny_pts") as HTMLInputElement).value = maxDestinyPoints.toString()
        }
    }, [destinyTreesSelectedLength])

    return (
        <div className="flex flex-col gap-2">
            <span className="text-teal-500 dark:text-cyan-300">Randomizer Options</span>

            <div
                className="flex flex-col gap-3 p-3 rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
                <div className="flex flex-wrap items-center">
                    <div className="w-40">
                        <span>Enhancement Trees :</span>
                    </div>
                    <div className="flex flex-col grow gap-2">
                        <Label htmlFor="randomize-enhancement-trees-checkbox"
                               className="flex items-center gap-2 m-auto">
                            <Checkbox
                                className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                                checked={randomizerOptions.enhancement.randomize}
                                id="randomize-enhancement-trees-checkbox"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.checked, 'enhancement', 'randomize')}
                            />
                            Randomize
                        </Label>

                        {randomizerOptions.enhancement.randomize ? (
                            <div className="flex flex-wrap flex-col grow gap-2">
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Label htmlFor="no_capstone" className="flex items-center gap-2">
                                        <Radio id="no_capstone"
                                               value="no_capstone"
                                               checked={randomizerOptions.enhancement.capstone === 'no_capstone'}
                                               onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'enhancement', 'capstone')}
                                               name="capstone"
                                               className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                        />
                                        No forced capstone
                                    </Label>
                                    <Label htmlFor="class_capstone" className="flex items-center gap-2">
                                        <Radio id="class_capstone"
                                               value="class_capstone"
                                               checked={randomizerOptions.enhancement.capstone === 'class_capstone'}
                                               onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'enhancement', 'capstone')}
                                               name="capstone"
                                               className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                        />
                                        Class capstone

                                        <Tooltip content="This option prevents multiclassing.">
                                            <HiExclamationCircle size={20}/>
                                        </Tooltip>
                                    </Label>
                                    <Label htmlFor="universal_capstone" className="flex items-center gap-2">
                                        <Radio id="universal_capstone"
                                               value="universal_capstone"
                                               checked={randomizerOptions.enhancement.capstone === 'universal_capstone'}
                                               onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'enhancement', 'capstone')}
                                               name="capstone"
                                               className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                        />
                                        Universal capstone

                                        <Tooltip
                                            content="This will be ignored if no universal tree is selected.">
                                            <HiExclamationCircle size={20}/>
                                        </Tooltip>
                                    </Label>
                                </div>

                                <Label htmlFor="racial_pts" className="flex flex-wrap items-center justify-center gap-2 m-auto">
                                    Racial Points (max {maxRacialPoints})
                                    <TextInput
                                        id="racial_pts"
                                        placeholder={minRacialPoints.toString()}
                                        type="number"
                                        min={minRacialPoints}
                                        max={maxRacialPoints}
                                        /*value={randomizerOptions.enhancement.racial_points}*/
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => () => togglePoints(e, 'enhancement')}
                                    />
                                </Label>
                            </div>
                        ) : null}
                    </div>
                </div>

                <hr/>

                <div className="flex flex-wrap items-center">
                    <div className="w-40">
                        <span>Destiny Trees :</span>
                    </div>
                    <div className="flex flex-col grow gap-2">
                        <Label htmlFor="randomize-destiny-trees-checkbox" className="flex items-center gap-2 m-auto">
                            <Checkbox
                                className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                                checked={randomizerOptions.destiny.randomize}
                                id="randomize-destiny-trees-checkbox"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.checked, 'destiny', 'randomize')}
                            />
                            Randomize
                        </Label>

                        {randomizerOptions.destiny.randomize ? (
                            <div className="flex flex-wrap flex-col grow gap-2">
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Label htmlFor="without_tier5" className="flex items-center gap-2">
                                        <Radio id="without_tier5"
                                               value="without_tier5"
                                               checked={randomizerOptions.destiny.tier5 === 'without_tier5'}
                                               onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'destiny', 'tier5')}
                                               name="destiny_tier5"
                                               className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                        />
                                        No forced tier 5
                                    </Label>
                                    <Label htmlFor="with_tier5" className="flex items-center gap-2">
                                        <Radio id="with_tier5"
                                               value="with_tier5"
                                               checked={randomizerOptions.destiny.tier5 === 'with_tier5'}
                                               onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'destiny', 'tier5')}
                                               name="destiny_tier5"
                                               className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                        />
                                        Force a tier 5
                                    </Label>
                                </div>

                                <Label htmlFor="destiny_pts" className="flex flex-wrap items-center justify-center gap-2 m-auto">
                                    Destiny Points (max {maxDestinyPoints} at level {maxLevel})
                                    <TextInput
                                        id="destiny_pts"
                                        placeholder={minDestinyPoints.toString()}
                                        type="number"
                                        min={minDestinyPoints}
                                        max={maxDestinyPoints}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => togglePoints(e, 'destiny')}
                                    />
                                </Label>
                            </div>
                        ) : null}
                    </div>
                </div>

                {randomizerOptions.enhancement.capstone !== 'class_capstone' ? (
                    <>
                        <hr/>
                        <div className="flex flex-wrap items-center">
                            <div className="w-40">
                                <span>Number of multiclass :</span>
                            </div>
                            <div className="flex flex-wrap gap-3 m-auto">
                                {Object.keys(randomizerOptions.multiclass).map((option: string, k: number) =>
                                    <Label key={k} htmlFor={`class_${k}`} className="flex items-center gap-2">
                                        <Checkbox
                                            className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                                            checked={randomizerOptions.multiclass[+option]}
                                            id={`class_${k}`}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.checked, 'multiclass', +option)}
                                        />
                                        {option} {+option > 1 ? 'classes' : 'class'}
                                    </Label>
                                )}
                            </div>
                        </div>
                    </>
                ) : null}

                <hr/>

                <div className="flex flex-wrap items-center">
                    <div className="w-40">
                        <span>Ability score weight :</span>
                    </div>
                    <div className="flex m-auto">
                        <div className="flex flex-wrap justify-center gap-2">
                            <Label htmlFor="no_weight" className="flex items-center gap-2">
                                <Radio id="no_weight"
                                       value="no_weight"
                                       checked={randomizerOptions.ability_score_weight === 'no_weight'}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'ability_score_weight')}
                                       name="weight"
                                       className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                />
                                Don&#39;t apply weight, let there be chaos
                            </Label>
                            <Label htmlFor="weight_main" className="flex items-center gap-2">
                                <Radio id="weight_main"
                                       value="weight_main"
                                       checked={randomizerOptions.ability_score_weight === 'weight_main'}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'ability_score_weight')}
                                       name="weight"
                                       className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                />
                                Apply stat weight based off the main class
                            </Label>
                            <Label htmlFor="weight_all" className="flex items-center gap-2">
                                <Radio id="weight_all"
                                       value="weight_all"
                                       checked={randomizerOptions.ability_score_weight === 'weight_all'}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => toggle(e.currentTarget.value, 'ability_score_weight')}
                                       name="weight"
                                       className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                                />
                                Apply stat weight based off all the classes selected
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}