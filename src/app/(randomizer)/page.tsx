"use client"

import UpdateNotes from '@/components/randomizer/UpdateNotes'
import Options from '@/components/randomizer/Options'
import Classes from '@/components/randomizer/Classes'
import Races from '@/components/randomizer/Races'
import Alignments from '@/components/randomizer/Alignments'
import UniversalTrees from '@/components/randomizer/UniversalTrees'
import DestinyTrees from '@/components/randomizer/DestinyTrees'
import RandomizerOptions from '@/components/randomizer/RandomizerOptions'
import {useEffect, useEffectEvent, useState} from "react";
import type { Races as RacesType } from "@/types/races"
import type { Classes as ClassesType } from "@/types/classes"
import type { Alignment as AlignmentType } from "@/types/alignments"
import type { Stat as StatType } from "@/types/stats"
import type { UniversalTree as UniversalTreeType } from "@/types/universal_trees"
import type { DestinyTree as DestinyTreeType } from "@/types/destiny_trees"
import Loading from "@/app/(randomizer)/loading";
import StartingStats from "@/components/randomizer/StartingStats";
import {Button, ButtonGroup} from "flowbite-react";

export default function Randomizer() {
    const [isDataLoaded, setisDataLoaded] = useState<boolean>(false)
    const [displayNames, setDisplayNames] = useState<boolean>(false)
    const [races, setRaces] = useState<null|RacesType>(null)
    const [classes, setClasses] = useState<null|ClassesType>(null)
    const [alignments, setAlignments] = useState<null|Array<AlignmentType>>(null)
    const [stats, setStats] = useState<null|Array<StatType>>(null)
    const [universalTrees, setUniversalTrees] = useState<null|Array<UniversalTreeType>>(null)
    const [destinyTrees, setDestinyTrees] = useState<null|Array<DestinyTreeType>>(null)

    const fetchLocalStorage = useEffectEvent(() => {
        setDisplayNames(!localStorage.getItem("displayNames") || localStorage.getItem("displayNames") === "true")
    })

    useEffect(() => {
        fetchLocalStorage();

        Promise.all([
            fetch(`/api/races`, {cache: 'no-store'}).then(r => r.json()).then(r => setRaces(r)),
            fetch(`/api/classes`, {cache: 'no-store'}).then(r => r.json()).then(r => setClasses(r)),
            fetch(`/api/alignments`, {cache: 'no-store'}).then(r => r.json()).then(r => setAlignments(r)),
            fetch(`/api/stats`, {cache: 'no-store'}).then(r => r.json()).then(r => setStats(r)),
            fetch(`/api/universal_trees`, {cache: 'no-store'}).then(r => r.json()).then(r => setUniversalTrees(r)),
            fetch(`/api/destiny_trees`, {cache: 'no-store'}).then(r => r.json()).then(r => setDestinyTrees(r)),
        ])
            .then(() => setisDataLoaded(true));
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

                {stats ? <StartingStats stats={stats} editStats={setStats} /> : <Loading name="stats" />}

                {universalTrees ? <UniversalTrees universalTrees={universalTrees} editUniversalTrees={setUniversalTrees} /> : <Loading name="universal trees" />}

                {destinyTrees ? <DestinyTrees destinyTrees={destinyTrees} editDestinyTrees={setDestinyTrees} /> : <Loading name="destiny trees" />}

                {destinyTrees ? <RandomizerOptions destinyTreesSelectedLength={destinyTrees.filter((dT: DestinyTreeType) => dT.isBought).length} /> : <Loading name="randomizer options" />}

                <ButtonGroup className="rounded-lg justify-center shadow-none">
                    <Button outline color="cyan" disabled={ !isDataLoaded }>Randomize !</Button>
                    <Button outline color="pink" disabled={ !isDataLoaded }>Clear</Button>
                </ButtonGroup>
            </div>
        </div>
    );
}