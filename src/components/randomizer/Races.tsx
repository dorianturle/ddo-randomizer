import {ChangeEvent, Dispatch, Fragment } from "react";
import {Checkbox, Label, Tooltip} from "flowbite-react";
import type {Race, Races, Stat} from "@/types/races";
import {isSelected} from "@/utils/randomizer";
import Image from "next/image"

export function Icons({ data, dataType, color, displayNames, setChange } : { data : Race[], dataType: string, color: string, displayNames: boolean, setChange: (e: ChangeEvent<HTMLInputElement>, type?: string, k?: number) => void }) {
    return (
        <div className={`flex flex-col gap-2 p-2 grow ${color} ${dataType === 'free' ? 'rounded-l-lg' : dataType === 'iconic' ? 'rounded-r-lg' : ''}`}>
            <span className="text-center text-slate-900">{dataType.charAt(0).toUpperCase() + dataType.slice(1)}</span>
            <div className="flex flex-wrap justify-center gap-3">
                { data.map((type: Race, k: number) =>
                    <Tooltip key={k} content={
                        <div className="flex flex-col">
                            <span>Name : <span className="text-blue-500">{type.name}</span></span>
                            {type.statsMod ?
                                <span>
                                    Stats modifiers :
                                    {type.statsMod.increasedStats.map((stat: Stat, key: number) =>
                                        <Fragment key={key}>
                                            {key === 0 && ' '}
                                            {key > 0 && ', '}
                                            <span className="text-green-500">{stat.name}</span>
                                        </Fragment>
                                    )}
                                    {type.statsMod.loweredStats ? type.statsMod.loweredStats.map((stat: Stat, key: number) =>
                                        <Fragment key={key}>
                                            {key === 0 && type.statsMod?.increasedStats.length ? ', ' : ''}
                                            {key > 0 && ', '}
                                            <span className="text-red-500">{stat.name}</span>
                                        </Fragment>
                                    ) : null}
                                </span>
                             : null}
                        </div>
                    }>
                        <Checkbox className="hidden" checked={type.selected} id={`${dataType}_race_${type.alias}`}
                                  onChange={e => setChange(e, dataType, k)}
                        />
                        <Label htmlFor={`${dataType}_race_${type.alias}`} className="flex flex-col items-center text-center w-12">
                            <Image src={`/images/races/${dataType}/${type.alias}_race_icon.png`}
                                   alt={type.name}
                                   title={type.name}
                                   width={0}
                                   height={0}
                                   sizes="100vw"
                            />
                            {displayNames ? <small>{type.name}</small> : null}
                        </Label>
                    </Tooltip>
                ) }
            </div>
        </div>
    );
}

export default function Races({races, editRaces, displayNames}: {
    races: Races,
    editRaces: Dispatch<Races>,
    displayNames: boolean
}) {
    const toggle = (e: ChangeEvent<HTMLInputElement>, type?: string, k?: number): void => {
        let toggledClasses: [string, Race[]][] = JSON.parse(JSON.stringify(Object.entries(races)))

        toggledClasses.forEach(( [idx, val] : [idx: string, val: Race[]] ): void => {
            if (type && type !== idx) return;

            return val.forEach((c: Race, raceIdx: number) : void => {
                if (k !== undefined && k !== raceIdx) return;

                c.selected = e.target.checked
            })
        })

        editRaces(Object.fromEntries(toggledClasses) as Races)
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <span className="text-teal-500 dark:text-cyan-300">Race Selector</span>
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Checkbox id="all_races"
                              checked={isSelected<Race>(races['free']) && isSelected<Race>(races['premium']) && isSelected<Race>(races['iconic'])}
                              onChange={e => toggle(e)}/>
                    <Label htmlFor="all_races">Select all</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="free_race" checked={isSelected<Race>(races['free'])} onChange={e => toggle(e, 'free')}/>
                    <Label htmlFor="free_race">Select all free races</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="premium_race" checked={isSelected<Race>(races['premium'])} onChange={e => toggle(e, 'premium')}/>
                    <Label htmlFor="premium_race">Select all premium races</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="iconic_race" checked={isSelected<Race>(races['iconic'])} onChange={e => toggle(e, 'iconic')}/>
                    <Label htmlFor="iconic_race">Select all iconic races</Label>
                </div>
            </div>

            <div className="flex">
                { races.free ? <Icons data={races.free} dataType="free" displayNames={displayNames} setChange={toggle} color="bg-blue-500" /> : null }
                { races.premium ? <Icons data={races.premium} dataType="premium" displayNames={displayNames} setChange={toggle} color="bg-red-700" /> : null }
                { races.iconic ? <Icons data={races.iconic} dataType="iconic" displayNames={displayNames} setChange={toggle} color="bg-yellow-500" /> : null }
            </div>
        </div>
    );
}