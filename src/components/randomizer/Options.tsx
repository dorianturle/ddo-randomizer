import {Dispatch} from "react";
import {Checkbox, Label} from "flowbite-react";

export default function Options({ displayNames, editDisplay } : {displayNames: boolean, editDisplay : Dispatch<boolean>}) {
    const onChangeDisplayNames = () => {
        localStorage.setItem("displayNames", (!displayNames).toString())
        editDisplay(!displayNames)
    }

    return (
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Options</h3>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-gray-300 border rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full border-b border-none">
                    <div className="flex items-center pl-3">
                        <Checkbox id="display-names-checkbox-list" checked={displayNames}
                               onChange={onChangeDisplayNames}
                               className="w-4 h-4"/>
                        <Label htmlFor="display-names-checkbox-list"
                               className="p-2">
                            Display names for classes and races
                        </Label>
                    </div>
                </li>
            </ul>
        </div>
    );
}