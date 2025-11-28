"use client"

import { useEffect, useState } from "react";

export default function Options() {
    const [displayNames, setDisplayNames] = useState<boolean>(false)
    
    const onChangeDisplayNames = () => {
        localStorage.setItem("displayNames", (!displayNames).toString())
        setDisplayNames(!displayNames)
    }

    return (
        <>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Options</h3>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-gray-100 border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">

                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center pl-3">
                        <input id="display-names-checkbox-list" type="checkbox" checked={displayNames}
                               onChange={onChangeDisplayNames}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                        <label htmlFor="display-names-checkbox-list"
                               className="w-full p-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Display names for classes and races
                        </label>
                    </div>
                </li>
            </ul>
        </>
    );
}