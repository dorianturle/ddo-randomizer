import {ChangeEvent, Dispatch} from "react";
import {Checkbox, Label} from "flowbite-react";
import type {DestinyTree} from "@/types/destiny_trees";import {isSelected} from "@/utils";

export function Options({ data, setChange } : { data : DestinyTree[], setChange: (e: ChangeEvent<HTMLInputElement>, k?: number) => void }) {
    return (
        <div className="flex flex-wrap justify-center gap-3 p-3 grow rounded-lg text-gray-900 bg-gray-300 dark:bg-gray-700 dark:text-white">
            { data.map((option: DestinyTree, k: number) =>
                !option.core ?
                    <Label key={k} htmlFor={`universal_tree_${option.alias}`} className="flex items-center gap-2">
                        <Checkbox
                            className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                            checked={option.isBought}
                            id={`universal_tree_${option.alias}`}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setChange(e, k)}
                        />
                        {option.name}
                    </Label> : null
            )}
        </div>
    );
}

export default function DestinyTrees({destinyTrees, editDestinyTrees}: {
    destinyTrees: Array<DestinyTree>,
    editDestinyTrees: Dispatch<Array<DestinyTree>>
}) {

    const toggle = (e: ChangeEvent<HTMLInputElement>, k?: number) => {
        let toggledDestinyTrees: Array<DestinyTree> = JSON.parse(JSON.stringify(destinyTrees))

        toggledDestinyTrees.forEach((destiny_tree: DestinyTree, key): void => {
            if (k !== undefined && k !== key) return;

            destiny_tree.isBought = e.target.checked
        })

        editDestinyTrees(toggledDestinyTrees as Array<DestinyTree>)
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <span className="text-teal-500 dark:text-cyan-300">Destiny Trees Unlocked</span>

            <div className="flex">
                <Options data={destinyTrees} setChange={toggle} />
            </div>
        </div>
    );
}