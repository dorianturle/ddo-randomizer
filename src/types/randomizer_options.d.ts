export type RandomizerOptions = {
    [key: string]: any;
    enhancement: Enhancement;
    destiny: Destiny;
    multiclass: Multiclass;
    ability_score_weight: "no_weight"|"weight_main"|"weight_all";
}

type Enhancement = {
    randomize: boolean;
    capstone: "no_capstone"|"class_capstone"|"universal_capstone";
    racial_points: number;
}

type Destiny = {
    randomize: boolean;
    tier5: "without_tier5"|"with_tier5";
    destiny_points: number;
}

type Multiclass = { [key: number]: boolean }