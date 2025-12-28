import { Injectable } from '@angular/core';
import { baseGraphCMSFetch } from '../base_request';
import { IsValidSportRecord, SportRecord } from '../interfaces/sportRecord';
import { dateToStringFormat, logErrors } from '../helpers';
import { Expansion } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SportsRecordService {

  async getAllRecords () {
    let result: SportRecord[] = [];
    
    var cont = 0 ;
    while(true){

      const cmsQuery = { 
          query : `
              query MyQuery {
                  sportsRecords(first: 100, skip: ${cont * 100}, stage: PUBLISHED) {
                      id
                      round
                      gameStatus
                      data
                      team
                      active
                      participant {
                        id
                        name
                      }
                  }
              }
      `};
      
      let aux = (await baseGraphCMSFetch(cmsQuery))?.data?.sportsRecords;

      if (aux?.length > 0)
      {
        result = result.concat(aux);
        cont++;
      }
      else {
        break;
      }      
    }

    return result;
  }
  
  // date = aaaa-mm-dd
  async getDailyRecords (date: string) {
      const cmsQuery = { 
          query : `
              query MyQuery {
                  sportsRecords(where: {data: "${date}"}, last: 500) {
                      id
                      round
                      gameStatus
                      data
                      team
                      active
                      participant {
                        id
                        name
                      }
                  }
              }
      `};

      return (await baseGraphCMSFetch(cmsQuery))?.data?.sportsRecords;
  }

  async publishSportRecord(id: string) {    
    const cmsQuery = {
        query: `
            mutation {
                publishSportsRecord(to:PUBLISHED, where:{id: "${id}"}) {
                    id
                }
            }
        `
    };

    return await baseGraphCMSFetch(cmsQuery);
  }
  async unpublishSportRecord(id: string) {    
    const cmsQuery = {
        query: `
            mutation {
                unpublishSportsRecord(where:{id: "${id}"}) {
                    id
                }
            }
        `
    };

    return await baseGraphCMSFetch(cmsQuery);
  }

  async addSportRecord(sportRecord: SportRecord) {    
    try {
      if (IsValidSportRecord(sportRecord)) {        
        const cmsQuery = { 
            query : `
                mutation {
                    createSportsRecord(data: {                      
                      round: ${sportRecord.round},
                      gameStatus: ${sportRecord.gameStatus},                
                      data: "${dateToStringFormat(sportRecord.data)}",
                      team: "${sportRecord.team}",
                      active: ${sportRecord.active},
                      participant: {connect: {id: "${sportRecord.participant.id}"} },
                    }) { id }
                }
        `};

        var res = await baseGraphCMSFetch(cmsQuery);
        const newSportsRecord = {...sportRecord, id: res?.data?.createSportsRecord?.id};
        await this.publishSportRecord(newSportsRecord?.id);
        return newSportsRecord.id;
      }

      throw new Error("Validação não aprovada do Registro Esportivo!");
    }catch(error: any) {
      logErrors("Erro ao adicionar o registro esportivo!", error.toString())
    }
  }
  
  async delete(id: string) {
    try{
      if (id) {
        await this.unpublishSportRecord(id);
        return true;
      }

      throw new Error("Id não preenchido.");
    }catch (error: any) {
      logErrors("Erro ao excluir registro esportivo!", error.toString());
      return false;
    }
    
  }

  async update(sportRecord: SportRecord) {
    try {
      if (IsValidSportRecord(sportRecord)) {
        const cmsQuery = { 
          query : `
              mutation {
                  updateSportsRecord(data: {
                    gameStatus: ${sportRecord.gameStatus},
                    data: "${sportRecord.data}",
                    round: ${sportRecord.round},
                    team: "${sportRecord.team}",
                    active: ${sportRecord.active}
                  }, where: {id: "${sportRecord.id}"}) { id }
              }
        `};

        await baseGraphCMSFetch(cmsQuery);
        await this.publishSportRecord(sportRecord.id);
        return true;
      }

      throw new Error("Validação não aprovada do Registro Esportivo!");
    }catch(error: any) {
      logErrors("Erro ao atualizar registro esportivo.", error.toString());
      return false;
    }    
  }

  async getDayLastRoundNumber(date: string){
    try {
      if (date) {
        const cmsQuery = { 
          query : `
          query Myquery {
              sportsRecords(
                where: {data: "${date}"}, 
                first: 1,
                orderBy: round_DESC
            ){
                round    
            }    
              
          }          
        `};

        const data = await baseGraphCMSFetch(cmsQuery);
        return data?.data?.sportsRecords?.[0]?.round;
      }

      throw new Error("Erro ao obter o id da próxima rodada!");
    }catch(error: any) {
      logErrors("Erro na query.", error.toString());
      return false;
    }
  }

  async getParticipantRoundsPlayed(participantId: string, date: string) {
    try {
      if (participantId) {
        const cmsQuery = { 
          query : `
          query Myquery {
              sportsRecords(
                where: {data: "${date}", participant:{id: "${participantId}"}}, 		
            ){
                gameStatus
                participant { name }
                round
                active
              }    
                
          }        
        `};

        const data = await baseGraphCMSFetch(cmsQuery);
        return data?.data?.sportsRecords;
      }

      throw new Error(`Erro ao obter o registro do dia do participante '${participantId}}'!`);
    }catch(error: any) {
      logErrors(error.toString());
      return false;
    }
  }
}
