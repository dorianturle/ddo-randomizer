"use client"

import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

export default function UpdateNotes() {
    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            <div className="flex justify-center">
                <div className="flex">
                    <Button onClick={() => setOpenModal(true)}>Update Notes</Button>
                </div>
            </div>

            <Modal dismissible size="3xl" show={openModal} onClose={() => setOpenModal(false)}>
            <ModalHeader>Update Notes</ModalHeader>
            <ModalBody>
                <div className="flex flex-col gap-5 text-white">
                    <div className="flex flex-col gap-2 bg-cyan-600 rounded-sm p-3">
                        <h2 className="text-2xl underline font-bold">2024-02-29</h2>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Feature</h3>
                            <ul>
                                <li>- Added the Dragon Lord archetype.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-gray-600 rounded-sm p-3">
                        <h2 className="text-2xl underline font-bold">2023-07-27</h2>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Features</h3>
                            <ul>
                                <li>- Added the Machro-Technic Epic Destiny.</li>
                                <li>- Added Racial and Destiny points inputs for characters with more than the minimum
                                    amount of points
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-gray-600 rounded-sm p-3">
                        <h2 className="text-2xl underline font-bold">2023-07-13</h2>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Features</h3>
                            <ul>
                                <li>- <span className="font-bold text-green-500">NEW !</span> Added an optional destiny
                                    trees randomizer (if you can make it to 32).
                                </li>
                                <li>- Redesigned some results table columns a bit so everything fits better</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-gray-600 rounded-sm p-3">
                        <h2 className="text-2xl underline font-bold">2023-07-12</h2>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Features</h3>
                            <ul>
                                <li>- Allow the choice to force a class or an universal capstone</li>
                                <li>- Some elements have been moved to new categories</li>
                                <li>- <span className="font-bold text-green-500">NEW !</span> Added an icon at the end
                                    of the table to download a .txt of the build or copy the raw text
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Fixes</h3>
                            <ul>
                                <li>- Alignement now properly takes into account the 2nd and 3rd class (true neutral
                                    paladins or monks are no more, they have to follow the law again)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-gray-600 rounded-sm p-3">
                        <h2 className="text-2xl underline font-bold">2023-07-07</h2>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Features</h3>
                            <ul>
                                <li>- <span className="font-bold text-green-500">NEW !</span> Added an optional
                                    enhancement trees randomizer, there is now even more random to your random character
                                    !
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Adjustments</h3>
                            <ul>
                                <li>- The &quot;display names&quot; option state is now saved for future visits</li>
                                <li>- Tooltips should be more readable</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Fixes</h3>
                            <ul>
                                <li>- Fix a crash when selecting only a class and its archetype</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className="justify-end" >
                <Button onClick={() => setOpenModal(false)}>Close</Button>
            </ModalFooter>
        </Modal>
        </>
    );
}