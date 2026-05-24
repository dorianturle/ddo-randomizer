"use client"

import {memo, useEffect, useEffectEvent, useState} from "react";
import {Button, ButtonGroup} from "flowbite-react";
import Loading from "@/app/(randomizer)/loading";

import UpdateNotes from '@/components/randomizer/UpdateNotes'
import Options from '@/components/randomizer/Options'
import Classes from '@/components/randomizer/Classes'
import Races from '@/components/randomizer/Races'
import Alignments from '@/components/randomizer/Alignments'
import UniversalTrees from '@/components/randomizer/UniversalTrees'
import DestinyTrees from '@/components/randomizer/DestinyTrees'
import RandomizerOptions from '@/components/randomizer/RandomizerOptions'
import AbilityPoints from "@/components/randomizer/AbilityPoints";
import Results from "@/components/randomizer/Results";

import { randomize } from "@/scripts/randomizer_calc";

import type { Races as RacesType } from "@/types/races"
import type { Classes as ClassesType } from "@/types/classes"
import type { Alignment as AlignmentType } from "@/types/alignments"
import type { AbilityPoints as AbilityPointsType } from "@/types/ability_points"
import type { UniversalTree as UniversalTreeType } from "@/types/universal_trees"
import type { DestinyTree as DestinyTreeType } from "@/types/destiny_trees"
import type { RandomizerOptions as RandomizerOptionsType } from "@/types/randomizer_options"
import type { Results as ResultsType } from "@/types/results"

export default function Randomizer() {
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false)
    const [displayNames, setDisplayNames] = useState<boolean>(!localStorage?.getItem("displayNames") || localStorage.getItem("displayNames") === "true")
    const [races, setRaces] = useState<null|RacesType>(null)
    const [classes, setClasses] = useState<null|ClassesType>(null)
    const [alignments, setAlignments] = useState<Array<AlignmentType>>([])
    const [abilityPoints, setAbilityPoints] = useState<Array<AbilityPointsType>>([])
    const [universalTrees, setUniversalTrees] = useState<Array<UniversalTreeType>>([])
    const [destinyTrees, setDestinyTrees] = useState<Array<DestinyTreeType>>([])
    const [randomizerOptions, setRandomizerOptions] = useState<null|RandomizerOptionsType>(null)

    const [results, setResults] = useState<Array<ResultsType>>([])

    useEffect(() => {
        Promise.all([
            fetch(`/api/races`, {cache: 'no-store'}).then(r => r.json()).then(r => setRaces(r)),
            fetch(`/api/classes`, {cache: 'no-store'}).then(r => r.json()).then(r => setClasses(r)),
            fetch(`/api/alignments`, {cache: 'no-store'}).then(r => r.json()).then(r => setAlignments(r)),
            fetch(`/api/ability_points`, {cache: 'no-store'}).then(r => r.json()).then(r => setAbilityPoints(r)),
            fetch(`/api/universal_trees`, {cache: 'no-store'}).then(r => r.json()).then(r => setUniversalTrees(r)),
            fetch(`/api/destiny_trees`, {cache: 'no-store'}).then(r => r.json()).then(r => setDestinyTrees(r)),
            fetch(`/api/randomizer_options`, {cache: 'no-store'}).then(r => r.json()).then(r => setRandomizerOptions(r)),
        ])
            .then(() => setIsDataLoaded(true));
    }, []);

    return (
        <div className="md:container px-2 mb-5 mx-auto">
            <h1 className="text-5xl font-bold text-center mb-3 wrap-break-word">
                DDO Class Randomizer
            </h1>

            <UpdateNotes />

            <div className="flex flex-col gap-5">
                <Options displayNames={displayNames} editDisplay={setDisplayNames} />

                {races ? <Races races={races} editRaces={setRaces} displayNames={displayNames} /> : <Loading name="races" />}

                {classes ? <Classes classes={classes} editClasses={setClasses} displayNames={displayNames} /> : <Loading name="classes" />}

                {alignments ? <Alignments alignments={alignments} editAlignments={setAlignments} /> : <Loading name="alignments" />}

                {abilityPoints ? <AbilityPoints abilityPoints={abilityPoints} editAbilityPoints={setAbilityPoints} /> : <Loading name="ability points" />}

                {universalTrees ? <UniversalTrees universalTrees={universalTrees} editUniversalTrees={setUniversalTrees} /> : <Loading name="universal trees" />}

                {destinyTrees ? <DestinyTrees destinyTrees={destinyTrees} editDestinyTrees={setDestinyTrees} /> : <Loading name="destiny trees" />}

                {randomizerOptions && destinyTrees
                    ? <RandomizerOptions randomizerOptions={randomizerOptions} editRandomizerOptions={setRandomizerOptions} destinyTreesSelectedLength={destinyTrees.filter((dT: DestinyTreeType) => dT.isBought).length} />
                    : <Loading name="randomizer options" />}

                {races && classes && randomizerOptions ?
                    <ButtonGroup className="rounded-lg justify-center shadow-none w-full">
                        <Button className="cursor-pointer" outline color="cyan" disabled={ !isDataLoaded }
                                onClick={() => setResults(randomize(results, races, classes, alignments, abilityPoints, universalTrees, destinyTrees, randomizerOptions))}
                        >
                            Randomize !
                        </Button>
                        <Button className="cursor-pointer" outline color="pink" disabled={ !isDataLoaded } onClick={() => setResults([])}>Clear</Button>
                    </ButtonGroup>
                    :
                    <Loading name="Buttons" />
                }

                {results ? <Results results={results} /> : <Loading name="Results" /> }
            </div>
        </div>
    );
}