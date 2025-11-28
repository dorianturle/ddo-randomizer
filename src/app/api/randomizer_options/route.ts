import {Destiny, Enhancement, RandomizerOptions} from "@/types/randomizer_options";
import {minDestinyPointsCalc, minRacialPoints} from "@/data/randomizer/randomizer_options";

const randomizer_options: RandomizerOptions = {
    enhancement: {
        randomize: true,
        capstone: "no_capstone",
        racial_points: minRacialPoints,
    },
    destiny:{
        randomize: true,
        tier5: "without_tier5",
        destiny_points: minDestinyPointsCalc,
    },
    multiclass: {
        1: true,
        2: true,
        3: true,
    },
    ability_score_weight: "no_weight",
}

export function GET(): Response {
    return Response.json(randomizer_options, { status: 200 });
}