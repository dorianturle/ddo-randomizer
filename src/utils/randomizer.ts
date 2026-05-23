export function filterSelected<T extends {selected?: boolean; isBought?: boolean}>(data: Array<T>): Array<T> {
    return JSON.parse(JSON.stringify(data)).filter((c: T) => c.selected || c.isBought || false)
}

export function isSelected<T extends {selected?: boolean; isBought?: boolean}>(data: T[]): boolean {
    return filterSelected<T>(data).length === data.length
}

export function filterCategory<T extends {category: string}>(data: T[], category: string): Array<T> {
    return JSON.parse(JSON.stringify(data)).filter((c: T) => c.category === category)
}

/*const toggle = <T extends {selected: boolean}, >(e: ChangeEvent<HTMLInputElement>, type?: string, k?: number) => {
        let toggledClasses: [string, Array<T>][] = JSON.parse(JSON.stringify(Object.entries(races)))

        toggledClasses.forEach(( [idx, val] : [idx: string, val: Array<T>] ) : void => {
            if (type && type !== idx) return;

            return val.forEach((c: T, raceIdx: number) => {
                if (k !== undefined && k !== raceIdx) return;

                c.selected = e.target.checked
            })
        })

        editRaces(Object.fromEntries(toggledClasses) as Races)
    } */
