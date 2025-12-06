import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { calculateLossAmount, calculateParticipantChampionshipPontuation, calculateParticipantHistory, calculateParticipationFrequency, calculateWinAmount } from 'src/app/helpers/score';
import { ClassificationTableRow } from 'src/app/interfaces/classificationTableRow';
import { SportRecord } from 'src/app/interfaces/sportRecord';
import { ParticipantService } from 'src/app/service/participant.service';
import { SportsRecordService } from 'src/app/service/sports-record.service';

@Component({
  selector: 'app-classification-table',
  templateUrl: './classification-table.component.html',
  styleUrls: ['./classification-table.component.css']
})
export class ClassificationTableComponent {
  sportsRecords: SportRecord[] = [];
  classificationTable: ClassificationTableRow[] = [];
  ascOrder: boolean[] = [true, true, true, true, true, true];
  @Input() date: string = "";
  @Input() refreshFlag: boolean = true;

  ngOnChanges(changes: { [property: string]: SimpleChange }){    
    if (changes['refreshFlag'].previousValue === undefined)
      return;
    
    if (changes['refreshFlag'].currentValue !== changes['refreshFlag'].previousValue)
    {
      this.sportsRecords = [];
      this.classificationTable = [];
      this.getSportsRecords();
    }
  }
  
  constructor(private participantService: ParticipantService, private sportsRecordService: SportsRecordService) {    
    this.getSportsRecords();
  }
  
  async getSportsRecords(){
    var result = this.date ? await this.sportsRecordService.getDailyRecords(this.date) : await this.sportsRecordService.getAllRecords();
    this.sportsRecords = result;
    this.buildClassificationDataStructure();
  }
  
  buildClassificationDataStructure(){    
    var participantsIDInCompetition = Array.from(new Set(this.sportsRecords.map(record => record.participant.id)));
    var participantsNameInCompetition = Array.from(new Set(this.sportsRecords.map(record => record.participant.name)));    
    
    for(let idx = 0; idx < participantsIDInCompetition.length; idx++){      
      var currentId = participantsIDInCompetition[idx];
      var currentName = participantsNameInCompetition[idx];

      var participantHistory = this.sportsRecords.filter(record => record.participant.id === currentId && record.active);
      if (participantHistory.length === 0)
        continue;
        
      let tableRow : ClassificationTableRow = {
        participant_id: participantHistory[0].participant.id,
        participant_name: participantHistory[0].participant.name,
        score: calculateParticipantChampionshipPontuation(participantHistory, this.date),
        wins: calculateWinAmount(participantHistory, this.date),
        losses: calculateLossAmount(participantHistory , this.date),
        history: calculateParticipantHistory(participantHistory, this.date),
        frequency: calculateParticipationFrequency(participantHistory, this.date),
        position: 1,
        supportScore: 0
      };

      tableRow.supportScore = tableRow.score * 100 + tableRow.frequency * 10 + tableRow.wins;
      this.classificationTable.push(tableRow);
    }
    
    this.classificationTable = this.classificationTable.sort((a, b) => b.supportScore - a.supportScore);
    for(let i=0;i<this.classificationTable.length;i++){
      
      if (i > 0) {
        if (this.classificationTable[i].supportScore === this.classificationTable[i-1].supportScore)
          this.classificationTable[i].position = this.classificationTable[i-1].position;
        else 
          this.classificationTable[i].position = this.classificationTable[i-1].position + 1;
      }
      else {
        this.classificationTable[i].position = i + 1;
      }
    }


    this.classificationTable = this.classificationTable.filter(x => x.score > 0);
  }

  sortTable(col: number) {
    if (col === 1)    
      this.classificationTable = this.classificationTable.sort((a:ClassificationTableRow, b: ClassificationTableRow) => {
        return !this.ascOrder[col-1] ? a.position - b.position : b.position - a.position;
      })
    if (col === 2)
      this.classificationTable = this.classificationTable.sort((a:ClassificationTableRow, b: ClassificationTableRow) => {
        return  a.participant_name > b.participant_name ?  !this.ascOrder[col-1] ? 1 : -1 : !this.ascOrder[col-1] ? -1 : 1;
      })
    if (col === 3)    
      this.classificationTable = this.classificationTable.sort((a:ClassificationTableRow, b: ClassificationTableRow) => {
        return !this.ascOrder[col-1] ? a.score - b.score : b.score - a.score;
      })
    if (col === 4)
      this.classificationTable = this.classificationTable.sort((a:ClassificationTableRow, b: ClassificationTableRow) => {
        return !this.ascOrder[col-1] ? a.frequency - b.frequency : b.frequency - a.frequency;
      })
    if (col === 5)
      this.classificationTable = this.classificationTable.sort((a:ClassificationTableRow, b: ClassificationTableRow) => {
        return !this.ascOrder[col-1] ? a.wins - b.wins : b.wins - a.wins;
      })
    if (col === 6)
      this.classificationTable = this.classificationTable.sort((a:ClassificationTableRow, b: ClassificationTableRow) => {
        return !this.ascOrder[col-1] ? a.losses - b.losses : b.losses - a.losses;
      })

    this.ascOrder[col-1] = !this.ascOrder[col-1];    
  }
}
