import { Participant } from "./participant";

export interface SportRecord {
    id: string;
    data: Date;
    round: number;
    gameStatus: string;
    team: string;
    active: boolean;
    participant: Participant;
}

export const sportRecordExample : SportRecord = {
    id: "",
    gameStatus: "L",
    data: new Date(2023, 6, 30),
    round: 1,
    team: "A",
    active: true,
    participant: {
    id: "clefmuzlhawht0blxd2q3jdl1",
    name: "Rodrigo Leão",
    alias: "Rodrigo",
    small_group_id: "",
    active: true,
    checked: false
    }
}

export const IsValidSportRecord = (sportRecord: SportRecord) => {
    if (!sportRecord.data || sportRecord.data == new Date(0))
        return false;
    
    if (sportRecord.round <= 0 && sportRecord.round !== -1)
        return false;

    if (!sportRecord.gameStatus)
        return false;

    if (!sportRecord.team)
        return false;

    if (!sportRecord.participant || !sportRecord.participant.id || !sportRecord.participant.name || !sportRecord.participant.alias)
        return false;

    return true;
}