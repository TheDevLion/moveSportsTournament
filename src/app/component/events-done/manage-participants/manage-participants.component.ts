import { Component } from '@angular/core';
import { dateToStringFormat, logErrors } from 'src/app/helpers';
import { getLocalStorageParticipants, saveLocalStorageParticipants, cleanLocalStorageParticipants } from 'src/app/helpers/participantsStorage';
import { MAX_GAME_SCORING } from 'src/app/helpers/score';
import { IsValidNewParticipant, Participant, emptyParticipant } from 'src/app/interfaces/participant';
import { SportRecord } from 'src/app/interfaces/sportRecord';
import { ParticipantService } from 'src/app/service/participant.service';
import { SportsRecordService } from 'src/app/service/sports-record.service';

@Component({
  selector: 'app-manage-participants',
  templateUrl: './manage-participants.component.html',
  styleUrls: ['./manage-participants.component.css']
})
export class ManageParticipantsComponent {
  newParticipant: Participant = emptyParticipant;
  participants: Participant[] = [];
  sportsRecords: SportRecord[] = [];
  currentSportsRecords: SportRecord[] = [];  
  stageDate: string = dateToStringFormat(new Date());
  // stageDate: string = dateToStringFormat(new Date(2023,5,23));
  
  constructor(private participantService: ParticipantService, private sportsRecordService: SportsRecordService){
    this.loadParticipants();
    this.loadSportsRecords();
  }

  alert(message: any)
  {
    window.alert(message);
  }

  async loadSportsRecords() {
    const result = (await this.sportsRecordService.getDailyRecords(this.stageDate));
    this.sportsRecords = result;
  }

  async loadParticipants(){
    const result = (await this.participantService.getAllParticipants())?.sort((a: Participant, b: Participant) => a.name.localeCompare(b.name));    
    const localStorage = getLocalStorageParticipants();
    
    if (localStorage) {
      localStorage.forEach( (element: Participant) => {
        if (element.checked)
          result.find( (x: Participant) => x.id === element.id).checked = element.checked
      });
    }

    this.participants = result;
  }
  
  changeParticipantStatus(participantId: string){        
    if (participantId)
    {
      const participant = this.participants.find(x => x.id === participantId);
      if (participant)
      {
        participant.checked = !participant.checked;
        saveLocalStorageParticipants(this.participants);
        this.sportsRecords = this.sportsRecords.filter(x => x.participant.checked);
      }      
    }    
  }

  isParticipantSelected(participantId: string){
    return this.participants.find(x => x.id === participantId)?.checked;
  }

  async addParticipant(){
    if (IsValidNewParticipant(this.newParticipant))
    {       
      const result = await this.participantService.addParticipant(this.newParticipant);

      if (result === -1 )
        window.alert("Apelido já cadastrado! Por favor, escolha outro!");
      else if (result)
      {
        window.alert(`Participante '${this.newParticipant.name}' (${this.newParticipant.alias}) adicionado com sucesso!`)
        this.newParticipant.alias = "";
        this.newParticipant.name = "";
        this.loadParticipants();
      }else {
        window.alert(`Erro ao adicionar participante '${this.newParticipant.name}' (${this.newParticipant.alias})`);
      }
      
    }else {
      logErrors("Para inserir um novo participante, preencher nome e apelido!");
    }
  }

  cleanLocalStorageParticipants(){
    cleanLocalStorageParticipants();
    this.loadParticipants();
  }

  getCheckedParticipants() {
    return this.participants.filter(x => x.checked);
  }

  getCurrentMatchParticipants() {
    const dayParticipants = this.participants.filter(x => x.checked);
    const result = []

    for(let participant of dayParticipants)
    {
      const playerDayHistory = this.sportsRecords.filter(x => x.participant.id === participant.id && x.active)

      if (playerDayHistory.length < MAX_GAME_SCORING)
        result.push(participant);
    }

    return result;
  }
  getCurrentMatchParticipantsCount() {
    const result = this.getCurrentMatchParticipants();
    return result.length;
  }

  getDisabledMatchParticipants() {
    const dayParticipants = this.participants.filter(x => x.checked);    
    const result = []

    for(let participant of dayParticipants)
    {
      const playerDayHistory = this.sportsRecords.filter(x => x.participant.id === participant.id && x.active)      

      if (playerDayHistory.length >= MAX_GAME_SCORING)
        result.push(participant);
    }

    return result;
  }
  getDisabledMatchParticipantsCount() {
    const result = this.getDisabledMatchParticipants();
    return result.length;
  }

  getReportParticipants(){
    return `(${this.getCheckedParticipants().length}/${this.participants.length})`;
  }

  teamManagement(participant: Participant, team: string, titular: boolean = true){
    if (this.currentSportsRecords.find(x => x.participant.id === participant.id && x.team === team))
    {
      this.currentSportsRecords = this.currentSportsRecords.filter(x => x.participant.id !== participant.id);
    }else {
      if (!this.currentSportsRecords.find(x => x.participant.id === participant.id))
        this.currentSportsRecords.push({participant: participant, id: "", round: 1, team: team, gameStatus: "", data: new Date(), active: titular});
    }    
  }

  teamList(team: string){
    return this.currentSportsRecords.filter(x => x.team === team);
  }

  teamCountParticipants(team: string)
  {
    return this.teamList(team).length;
  }

  IsOnTeam(participant: Participant){
    return this.currentSportsRecords.find(x => x.participant.id === participant.id)?.team;
  }

  WillParticipantScore(participantId: string){
    return this.currentSportsRecords.find(x => x.participant.id === participantId)?.active;
  }

  changeActiveScore(participant: Participant){
    const member = this.currentSportsRecords.find(x => x.participant.id === participant.id);
    if (member)
      member.active = !member.active;
  }

  async saveWin(team: string){
    const lastRoundNumber = await this.sportsRecordService.getDayLastRoundNumber(this.stageDate) ?? 0;    
    if (this.teamCountParticipants('A') > 0 && this.teamCountParticipants('B') > 0)
    {      
      if(window.prompt(`Confirmar vitória do time ${team}`) === "")
      {        
        try{
          for(let member of this.currentSportsRecords)
          {
            const memberDayHistory = await this.sportsRecordService.getParticipantRoundsPlayed(member.participant.id, this.stageDate);
            const memberDayHistoryOnlyActive = memberDayHistory.filter((x: any) => x.active);

            member.gameStatus = team == member.team ? "W" : "L";
            member.round = lastRoundNumber + 1;
            member.data = new Date(`${this.stageDate} 00:00`);
            member.active = memberDayHistoryOnlyActive.length >= MAX_GAME_SCORING ? false : member.active;
  
            await this.sportsRecordService.addSportRecord(member);
          }

          window.alert("Rodada salva com sucesso!");          
          this.currentSportsRecords = [];
          location.reload();
        }
        catch(error: any)
        {
          logErrors("Erro ao salvar resultado do jogo!", error.toString());
        }        
      }
      else {
        // Desempate 1 ponto pro vencedor (triggon)
        try{          
          for(let member of this.currentSportsRecords)
          {            
            member.gameStatus = team == member.team ? "W" : "L";
            member.round = -1;
            member.data = new Date(`${this.stageDate} 00:00`);
            member.active = team == member.team;
  
            await this.sportsRecordService.addSportRecord(member);
          }

          window.alert("Desempate salvo com sucesso!");
          this.currentSportsRecords = [];
          location.reload();
        }
          catch(error: any)
        {
          logErrors("Erro ao salvar resultado do desempate!", error.toString());
        }
      }
    }
    else {
      window.alert("Os times devem conter ao menos um participante.")
    }
  }

}
