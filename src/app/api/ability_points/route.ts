import { Stat } from "@/types/ability_points"

const stats_list: number[] = [28, 32, 34, 36];

export function GET(): Response {
    const stats: Stat[] = stats_list.map((name: number) => ({ name: name.toString(), alias: `${name.toString()}pts`, selected: name === 28 }));

    return Response.json(stats, { status: 200 });
}