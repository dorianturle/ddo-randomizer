import {ChangeEvent, Dispatch} from "react";
import {Checkbox, Label} from "flowbite-react";
import type {UniversalTree} from "@/types/universal_trees";
import {isSelected} from "@/utils";

export function Options({ data, setChange } : { data : UniversalTree[], setChange: (e: ChangeEvent<HTMLInputElement>, k?: number) => void }) {
    return (
        <div className="flex flex-wrap justify-center gap-3 p-3 grow rounded-lg text-gray-900 bg-gray-300 dark:bg-gray-700 dark:text-white">
            { data.map((option: UniversalTree, k: number) =>
                <Label key={k} htmlFor={`universal_tree_${option.alias}`} className="flex items-center gap-2">
                    <Checkbox className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                              checked={option.selected}
                              id={`universal_tree_${option.alias}`}
                              onChange={(e : ChangeEvent<HTMLInputElement>) => setChange(e, k)}
                    />
                    {option.name}
                </Label>
            ) }
        </div>
    );
}

export default function UniversalTrees({universalTrees, editUniversalTrees}: {
    universalTrees: Array<UniversalTree>,
    editUniversalTrees: Dispatch<Array<UniversalTree>>
}) {
    const toggle = (e: ChangeEvent<HTMLInputElement>, k?: number) => {
        let toggledUniversalTrees: Array<UniversalTree> = JSON.parse(JSON.stringify(universalTrees))

        toggledUniversalTrees.forEach((universal_tree: UniversalTree, key): void => {
            if (k !== undefined && k !== key) return;

            universal_tree.selected = e.target.checked
        })

        editUniversalTrees(toggledUniversalTrees as Array<UniversalTree>)
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <span className="text-teal-500 dark:text-cyan-300">Universal Trees Unlocked</span>
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Checkbox id="all_universal_trees"
                              checked={isSelected<UniversalTree>(universalTrees)}
                              onChange={e => toggle(e)}/>
                    <Label htmlFor="all_universal_trees">Select all</Label>
                </div>
            </div>

            <div className="flex">
                <Options data={universalTrees} setChange={toggle} />
            </div>
        </div>
    );
}