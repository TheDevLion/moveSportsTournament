export interface Participant {
    id: string;
    name: string;
    alias: string;
    small_group_id: string;
    active: boolean;
    checked: boolean;
    mail?: string;
    phone?: string;
    birthday?: string;
}

export const emptyParticipant: Participant = {
    id: "",
    name: "",
    alias:"",
    small_group_id: "",
    active: true,
    checked: false,
}


export const IsValidNewParticipant = (participant: Participant) => {
    if (participant.name && participant.alias && participant.active)
        return true;

    return false;
}

export const IsValidParticipant = (participant: Participant) => {
    if (participant.id && participant.name && participant.alias && participant.active)
        return true;

    return false;
}