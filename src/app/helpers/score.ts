import { dateToOtherStringFormat, dateToStringFormat } from "../helpers";
import { SportRecord } from "../interfaces/sportRecord";

export const MAX_GAME_SCORING = 5;
export const WINNING_SCORE_POINTS = 100;
export const LOSING_SCORE_POINTS = 30;
export const BONUS_SCORE_POINTS = 10;
export const TIEBREAKE_BONUS_POINTS = 1;

export const calculateParticipantStagePontuation = (pontuation: SportRecord[]) => {
    const sortedRounds = pontuation.sort((a, b) => a.round - b.round).filter(x => x.active);

    let score = 0;
    for(let idx=0; idx < sortedRounds.length; idx++){
        if (sortedRounds[idx].round === -1)
            score += TIEBREAKE_BONUS_POINTS
        else{
            if (sortedRounds[idx].gameStatus.toUpperCase() === "L")
                score += LOSING_SCORE_POINTS;
            else if (sortedRounds[idx].gameStatus.toUpperCase() === "W"){
                score += WINNING_SCORE_POINTS;

                if (idx > 0 && sortedRounds[idx-1].gameStatus.toUpperCase() === "W" && sortedRounds[idx-1].round !== -1)
                    score += BONUS_SCORE_POINTS;
            }
        }        
    }

    return score;
}


export const calculateParticipantChampionshipPontuation = (pontuation: SportRecord[], date: string = "") => {
    let participantStageDates = Array.from(new Set(pontuation.map(record => record.data + "")));

    if (date)
        participantStageDates = [date];

    let score = 0;
    for(let idx=0; idx < participantStageDates.length; idx++){
        const participantStagePontuation = pontuation.filter(record => record.data + "" === participantStageDates[idx]);
        score += calculateParticipantStagePontuation(participantStagePontuation);
    }

    return score;
}

export const calculateWinAmount = (pontuation: SportRecord[], date: string = "") => {
    const winningGames = date ?
        pontuation.filter(record => record.gameStatus.toUpperCase() === "W" && record.active && date === record.data + "" && record.round > 0).sort((a, b) => a.round - b.round) :
        pontuation.filter(record => record.gameStatus.toUpperCase() === "W" && record.active && record.round > 0).sort((a, b) => a.round - b.round);
    
    return winningGames.length;
}
export const calculateLossAmount = (pontuation: SportRecord[], date: string = "") => {
    const losingGames = date ?
        pontuation.filter(record => record.gameStatus.toUpperCase() === "L" && record.active && date === record.data + "" && record.round > 0).sort((a, b) => a.round - b.round) :
        pontuation.filter(record => record.gameStatus.toUpperCase() === "L" && record.active && record.round > 0).sort((a, b) => a.round - b.round);
    return losingGames.length;
}
export const calculateParticipationFrequency = (pontuation: SportRecord[], date: string) => {
    return calculateWinAmount(pontuation, date) + calculateLossAmount(pontuation, date);
}

export const calculateParticipantHistory = (participantHistory: SportRecord[], date: string) => {
    const stageDates = date ? [date] : Array.from(new Set(participantHistory.map( (x: SportRecord) => x.data)));
    const result = [];

    for (let i=0; i < stageDates.length; i++)
    {
        var stageHistory = participantHistory.filter(record => record.active && record.data + "" === stageDates[i] && record.round > 0).map(x => x.gameStatus).join("");
        result.push(stageHistory.replaceAll("W", "V").replaceAll("L", "D"));
    }

    return result;
}