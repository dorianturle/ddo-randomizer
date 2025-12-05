import {ChangeEvent, Dispatch, Fragment, memo} from "react";
import {Checkbox, Label, Tooltip} from "flowbite-react";
import type {Class, Classes} from "@/types/classes";
import {isSelected} from "@/utils/randomizer";
import Image from "next/image";

export function Icons ({ data, dataType, color, displayNames, setChange } : {
    data : Class[], dataType: string, color: string, displayNames: boolean, setChange: (e: ChangeEvent<HTMLInputElement>, type?: string, k?: number) => void
}) {
    return (
        <div className={`flex flex-col gap-2 p-3 grow ${color} ${dataType === 'free' ? 'rounded-l-lg' : dataType === 'archetype' ? 'rounded-r-lg' : ''}`}>
            <span className="text-center text-slate-900">{dataType.charAt(0).toUpperCase() + dataType.slice(1)}</span>
            <div className="flex flex-wrap justify-center gap-2">
                { data.map((type, k) =>
                    <Tooltip key={k} content={
                        <div className="flex flex-col">
                            <span>Name: <span className="text-red-500">{type.name}</span></span>
                            <span>
                                Weight modifier : {type.weightedStats.map((stat, key) =>
                                <Fragment key={key}>
                                    {key > 0 && ', '}
                                    <span className="text-purple-400">{stat.name}</span>
                                </Fragment>
                            )}
                            </span>
                            <span>
                                Enhancement trees : {type.enhancementTrees.map((tree, key) =>
                                <Fragment key={key}>
                                    {key > 0 && ', '}
                                    <span className="text-green-400">{tree.name}</span>
                                </Fragment>
                            )}
                            </span>
                        </div>
                    }>
                        <Checkbox className="hidden" checked={type.selected} id={`${dataType}_class_${type.alias}`}
                                  onChange={e => setChange(e, dataType, k)}
                        />
                        <Label htmlFor={`${dataType}_class_${type.alias}`} className="flex flex-col items-center text-center w-14">
                            <Image src={`/images/classes/${dataType}/${type.alias}_class_icon.png`}
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

export default memo(function Classes({classes, editClasses, displayNames} : {
    classes: Classes,
    editClasses: Dispatch<Classes>,
    displayNames: boolean
}) {
    const toggle = (e: ChangeEvent<HTMLInputElement>, type?: string, k?: number) => {
        let toggledClasses: [string, Class[]][] = JSON.parse(JSON.stringify(Object.entries(classes)))

        toggledClasses.forEach(( [idx, val] : [idx: string, val: Class[]] ) : void => {
            if (type && type !== idx) return;

            return val.forEach((c: Class, raceIdx: number) => {
                if (k !== undefined && k !== raceIdx) return;

                c.selected = e.target.checked
            })
        })

        editClasses(Object.fromEntries(toggledClasses) as Classes)
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <span className="text-teal-500 dark:text-cyan-300">Class Selector</span>
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Checkbox id="all_class"
                              checked={isSelected<Class>(classes['free']) && isSelected<Class>(classes['premium']) && isSelected<Class>(classes['archetype'])}
                              onChange={e => toggle(e)}/>
                    <Label htmlFor="all_class">Select all</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="free_class" checked={isSelected<Class>(classes['free'])} onChange={e => toggle(e, 'free')}/>
                    <Label htmlFor="free_class">Select all free classes</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="premium_class" checked={isSelected<Class>(classes['premium'])} onChange={e => toggle(e, 'premium')}/>
                    <Label htmlFor="premium_class">Select all premium classes</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="archetype_class" checked={isSelected<Class>(classes['archetype'])} onChange={e => toggle(e, 'archetype')}/>
                    <Label htmlFor="archetype_class">Select all archetype classes</Label>
                </div>
            </div>

            <div className="flex">
                { classes.free ? <Icons data={classes.free} dataType="free" displayNames={displayNames} setChange={toggle} color="bg-blue-500" /> : null }
                { classes.premium ? <Icons data={classes.premium} dataType="premium" displayNames={displayNames} setChange={toggle} color="bg-red-700" /> : null }
                { classes.archetype ? <Icons data={classes.archetype} dataType="archetype" displayNames={displayNames} setChange={toggle} color="bg-yellow-500" /> : null }
            </div>
        </div>
    );
})