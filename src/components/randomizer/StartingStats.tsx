import {ChangeEvent, Dispatch, memo} from "react";
import {Label, Radio, Tooltip} from "flowbite-react";
import type {Stat} from "@/types/stats";
import {HiInformationCircle} from "react-icons/hi";

export function Options({ data, setChange } : { data : Stat[], setChange: (e: ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="flex flex-wrap justify-center gap-3 p-3 grow rounded-lg text-gray-900 bg-gray-300 dark:bg-gray-700 dark:text-white">
            { data.map((option: Stat, k: number) =>
                <Label key={k} htmlFor={`stat_${option.alias}`} className="flex items-center gap-2">
                    <Radio id={`stat_${option.alias}`} name="stats" value={option.name} checked={option.selected}
                           className="h-4 w-4 border border-gray-300 text-orange-500 dark:ring-offset-gray-700 focus:ring-2 focus:ring-orange-500 dark:border-gray-500 dark:bg-gray-700 dark:focus:bg-orange-500 dark:focus:ring-orange-500 "
                           onChange={setChange}
                    />
                    {option.name} points
                </Label>
            ) }
        </div>
    );
}

export default memo(function StartingStats({stats, editStats}: {
    stats: Array<Stat>,
    editStats: Dispatch<Array<Stat>>
}) {
    const toggle = (e: ChangeEvent<HTMLInputElement>): void => {
        let toggledStats: Array<Stat> = JSON.parse(JSON.stringify(stats))

        toggledStats.forEach((stat: Stat): void => {
            stat.selected = stat.name === e.target.value
        })

        editStats(toggledStats as Array<Stat>)
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <span className="text-teal-500 dark:text-cyan-300 flex items-center gap-1">
                Starting Stats Selector
                <Tooltip content="Iconics are by default 32 points. Drow always have 4 less starting points.">
                    <HiInformationCircle size={20} />
                </Tooltip>
            </span>

            <div className="flex">
                <Options data={stats} setChange={toggle} />
            </div>
        </div>
    );
})