export interface ClassificationTableRow{
    participant_id: string;
    participant_name: string;
    score: number;
    wins: number;
    losses: number;
    frequency: number;
    history: string[];
    position: number;
    supportScore: number;
}