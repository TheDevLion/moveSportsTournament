import { Participant } from "../interfaces/participant";

export const saveLocalStorageParticipants = (participants: Participant[]) => {
    window.localStorage.setItem("participants", JSON.stringify(participants));
}

export const getLocalStorageParticipants = () => {
    const result = window.localStorage.getItem("participants");

    return result ? JSON.parse(result) : false;
}

export const cleanLocalStorageParticipants = () => {
    window.localStorage.removeItem("participants");
}