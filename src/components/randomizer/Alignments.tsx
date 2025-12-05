import {ChangeEvent, Dispatch, memo} from "react";
import {Checkbox, Label} from "flowbite-react";
import type {Alignment} from "@/types/alignments";
import {isSelected, filterCategory} from "@/utils/randomizer";

export function Options({ data, setChange } : { data : Alignment[], setChange: (e: ChangeEvent<HTMLInputElement>, category?: string, k?: number) => void }) {
    return (
        <div className="flex flex-wrap justify-center gap-3 p-3 grow rounded-lg text-gray-900 bg-gray-300 dark:bg-gray-700 dark:text-white">
            { data.map((option: Alignment, k: number) =>
                <Label key={k} htmlFor={`alignment_${option.alias}`} className="flex items-center gap-2">
                    <Checkbox className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                              checked={option.selected}
                              id={`alignment_${option.alias}`}
                              onChange={(e : ChangeEvent<HTMLInputElement>) => setChange(e, option.category, k)}
                    />
                    {option.name}
                </Label>
            ) }
        </div>
    );
}

export default memo(function Alignments({alignments, editAlignments}: {
    alignments: Array<Alignment>,
    editAlignments: Dispatch<Array<Alignment>>
}) {
    const toggle = (e: ChangeEvent<HTMLInputElement>, category?: string, k?: number) => {
        let toggledAlignments: Array<Alignment> = JSON.parse(JSON.stringify(alignments))

        toggledAlignments.forEach((alignment: Alignment, key): void => {
            if (category !== undefined && alignment.category !== category) return;
            if (k !== undefined && k !== key) return;

            alignment.selected = e.target.checked
        })

        editAlignments(toggledAlignments as Array<Alignment>)
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <span className="text-teal-500 dark:text-cyan-300">Alignment Selector</span>
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Checkbox id="all_alignment"
                              checked={isSelected<Alignment>(filterCategory<Alignment>(alignments, 'lawful')) && isSelected<Alignment>(filterCategory<Alignment>(alignments, 'neutral')) && isSelected<Alignment>(filterCategory<Alignment>(alignments, 'chaotic'))}
                              onChange={e => toggle(e)}/>
                    <Label htmlFor="all_alignment">Select all</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="lawful_alignment" checked={isSelected<Alignment>(filterCategory<Alignment>(alignments, 'lawful'))} onChange={e => toggle(e, 'lawful')}/>
                    <Label htmlFor="lawful_alignment">Select all lawful alignments</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="neutral_alignment" checked={isSelected<Alignment>(filterCategory<Alignment>(alignments, 'neutral'))} onChange={e => toggle(e, 'neutral')}/>
                    <Label htmlFor="neutral_alignment">Select all neutral alignments</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="chaotic_alignment" checked={isSelected<Alignment>(filterCategory<Alignment>(alignments, 'chaotic'))} onChange={e => toggle(e, 'chaotic')}/>
                    <Label htmlFor="chaotic_alignment">Select all chaotic alignments</Label>
                </div>
            </div>

            <div className="flex">
                <Options data={alignments} setChange={toggle} />
            </div>
        </div>
    );
})