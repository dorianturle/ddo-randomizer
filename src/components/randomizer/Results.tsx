import type {Results as ResultsType} from "@/types/results";
import {Badge, Popover, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {Fragment, ReactNode} from "react";
import {BaseStats} from "@/types/races";
import {ChosenUniversalTree} from "@/types/universal_trees";
import {ChosenDestinyTree} from "@/types/destiny_trees";
import {ChosenClass} from "@/types/classes";

const getStatMod = (stat: number) => {
    const mod = Math.floor((stat / 2) - 5);
    return mod > 0 ? `+${mod}` : `${mod}`
}

const createBlobText = (item: ResultsType) => {
    const classes = Object.entries(item.classes).map(([, _class]: [string, ChosenClass]) => `${_class.levels} ${_class.name}`).join(" / ");
    const stats = item.stats.map((stat : BaseStats) => `${stat.name} : ${stat.value} (${getStatMod(stat.value)})`).join(" - ");
    const enhancement_trees = Object.entries(item.enhancement_trees).map(([key, trees]: [string, ChosenUniversalTree[]]) => `${key}: \n ${trees.map((tree : ChosenUniversalTree) => `\t${tree.name} : ${tree.value} point${tree.value > 1 ? 's' : ''}`).join("\n")}`).join("\n");
    const destiny_trees = item.destiny_trees.map((tree: ChosenDestinyTree) => `${tree.name} : ${tree.value}`).join(" / ");

    return `${item.alignment} ${item.race}\n\n${classes}\n\n${stats}${enhancement_trees.length > 0 ? `\n\n${enhancement_trees}` : ''}${destiny_trees.length > 0 ? `\n\n${destiny_trees}` : ''}`;
}

const download = (item: ResultsType) => {
    let blob = new Blob([ createBlobText(item) ], { type: "txt" });

    let a = document.createElement('a');
    a.download = `${item.alignment} ${item.race}`;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = ["txt", a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
    return false;
}

export default function Results({ results } : { results: ResultsType[] }) {

    return (
        <div className="w-full h-[426px] overflow-auto rounded-lg flex-wrap">
        <Table hoverable className="dark:bg-gray-800">
            <TableHead>
                <TableRow>
                    <TableHeadCell>Alignment</TableHeadCell>
                    <TableHeadCell>Race</TableHeadCell>
                    <TableHeadCell>Class 1</TableHeadCell>
                    <TableHeadCell>Class 2</TableHeadCell>
                    <TableHeadCell>Class 3</TableHeadCell>
                    <TableHeadCell>Stats</TableHeadCell>
                    <TableHeadCell>Enhancement Trees</TableHeadCell>
                    <TableHeadCell>Destiny Trees</TableHeadCell>
                    <TableHeadCell>Download / Copy</TableHeadCell>
                </TableRow>
            </TableHead>

            <TableBody className="text-gray-900 dark:text-white">
                { results.map((result, key) =>
                    <TableRow className="border-b last:border-b-0 dark:border-gray-700" key={key}>
                        <TableCell>{result.alignment}</TableCell>
                        <TableCell>{result.race}</TableCell>
                        {
                            [1, 2, 3].map((_: number, k: number) =>
                                <TableCell key={k}>
                                    {result.classes[k] ? `${result.classes[k].levels} ${result.classes[k].name}` : '-'}
                                </TableCell>
                            )
                        }

                        <TableCell>
                            <Popover
                                trigger="hover"
                                content={
                                    <div className="space-y-2 p-3">
                                        { result.stats.map((stat: BaseStats, k: number) =>
                                        <Fragment key={k}>
                                            <span className="font-bold">{stat.name}</span> : {stat.value} <span className={`text-${getStatMod(stat.value).includes('+') ? 'green' : 'red'}-500`}>({getStatMod(stat.value)})</span>
                                            {k < result.stats.length - 1 && ' - '}
                                        </Fragment>)
                                        }
                                    </div>
                                }
                            >
                                <Badge className="inline-flex px-2.5 py-0.5 rounded dark:hover:bg-gray-700" color="gray" size="sm">
                                    <span className="flex">
                                        Show Me
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>
                                        </svg>
                                    </span>
                                </Badge>
                            </Popover>
                        </TableCell>

                        <TableCell className="text-center">
                            {
                                Object.keys(result.enhancement_trees).length ?
                                    <Popover
                                        trigger="hover"
                                        content={
                                            <div className="space-y-2 p-3 flex flex-col">
                                                { Object.entries(result.enhancement_trees).map(([k, trees]: [string, ChosenUniversalTree[]]) =>
                                                    <Fragment key={k}>
                                                        <span className="flex flex-col">
                                                            <span className="underline">{k}</span>

                                                            {trees.map((tree : ChosenUniversalTree, idx: number) =>
                                                                <Fragment key={idx}>
                                                                    <span>{tree.name} : <span className="text-blue-500">{tree.value} point{tree.value > 1? 's' : ''}</span></span>
                                                                    {idx < trees.length - 1 && ' '}
                                                                </Fragment>
                                                            )}
                                                        </span>
                                                    </Fragment>)
                                                }
                                            </div>
                                        }
                                    >
                                        <Badge className="inline-flex px-2.5 py-0.5 rounded dark:hover:bg-gray-700" color="gray" size="sm">
                                            <span className="flex">
                                                Show Me
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>
                                                </svg>
                                            </span>
                                        </Badge>
                                    </Popover>
                                    : <> - </>
                            }
                        </TableCell>
                        <TableCell className="text-center">
                            {
                                result.destiny_trees.length ?
                                    <Popover
                                        trigger="hover"
                                        content={
                                            <div className="space-y-2 p-3 flex flex-col">
                                                { result.destiny_trees.map((dtree : ChosenDestinyTree, k: number) =>
                                                    <Fragment key={k}>
                                                        <span>{dtree.name} : <span className="text-blue-500">{dtree.value} point{dtree.value > 1? 's' : ''}</span></span>
                                                    </Fragment>)
                                                }
                                            </div>
                                        }
                                    >
                                        <Badge className="inline-flex px-2.5 py-0.5 rounded dark:hover:bg-gray-700" color="gray" size="sm">
                                            <span className="flex">
                                                Show Me
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>
                                                </svg>
                                            </span>
                                        </Badge>
                                    </Popover>
                                    : <> - </>
                            }
                        </TableCell>

                        <TableCell>
                            <div className="flex justify-center items-center gap-2">
                                <button onClick={() => download(result)} title="Download button"
                                        aria-label="Download character build">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                    </svg>
                                </button>
                                /
                                <button onClick={() => navigator.clipboard.writeText(createBlobText(result))}
                                        title="Copy button" aria-label="Copy character build to clipboard">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"/>
                                    </svg>
                                </button>
                            </div>


                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
        </div>
    )
}