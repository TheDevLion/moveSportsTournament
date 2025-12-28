import { Component, SimpleChange } from '@angular/core';
import { dateToOtherStringFormat, logErrors } from 'src/app/helpers';
import { isAdminMode } from 'src/app/helpers/adminToken';
import { SportRecord } from 'src/app/interfaces/sportRecord';
import { SportsRecordService } from 'src/app/service/sports-record.service';

@Component({
  selector: 'app-events-done',
  templateUrl: './events-done.component.html',
  styleUrls: ['./events-done.component.css']
})
export class EventsDoneComponent {
  adminMode: boolean = false;
  sportsRecords: SportRecord[] = [];
  stageDates: Date[] = [];
  refreshFlag: boolean = true;

  constructor(private sportsRecordService: SportsRecordService) {
    this.adminMode = isAdminMode();
    this.loadSportsRecords()
  }

  async loadSportsRecords(){
    const result = await this.sportsRecordService.getAllRecords();    
    this.sportsRecords = result;    
    this.stageDates = Array.from(new Set(result.map( (x: SportRecord) => x.data)));
    this.stageDates = this.stageDates.sort((a: Date, b: Date) => a > b ? -1 : 1);
  }

  dateToStringFormat(date: Date){
    return dateToOtherStringFormat(date);
  }

  GetStageRoundsAmount(date: Date){    
    const rounds = Array.from(new Set(this.sportsRecords.filter(x => x.data === date).map(y => Number(y.round)))).sort((a, b) => a > b ? -1 : 1);
    return rounds;
  }

  GetTeamStageRoundParticipants(date:Date, round: number, team: string){
    const participantsOfTeam = this.sportsRecords.filter(x => x.data === date && x.team === team && x.round === round);
    const participants = [];
    for(let i=0; i<participantsOfTeam.length; i++)
    {
      if(participantsOfTeam[i].active)
        participants.push(participantsOfTeam[i].participant.name);
      else
        participants.push(`${participantsOfTeam[i].participant.name}**`);
    }
    return participants;
  }

  GetWinnerTeam(date: Date, round: number){
    const winnerTeam = this.sportsRecords.find(x => x.data === date && x.gameStatus === "W" && x.round === round);
    return winnerTeam?.team;
  }

  refreshPage(){
    this.refreshFlag = !this.refreshFlag;
    this.sportsRecords = [];      
    this.loadSportsRecords();
  }

  async deleteRound(date: Date, round: number){
    try {
      if (window.confirm(`Deseja deletar a rodada ${round} do dia ${date}?`))
      {
        let dailyRecords = await this.sportsRecordService.getDailyRecords(date + "");
        dailyRecords = dailyRecords.filter((x: SportRecord) => x.round === round);
  
        for(let i of dailyRecords)
          await this.sportsRecordService.unpublishSportRecord(i.id);
        
        window.alert(`Rodada ${round} excluída com sucesso!`)
      }
    }catch(error: any)
    {
      logErrors(error);
    }
    
    
  }

}
