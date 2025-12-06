import { Injectable } from '@angular/core';
import { baseGraphCMSFetch } from '../base_request';
import { Participant } from '../interfaces/participant';
import { logErrors } from '../helpers';


@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  async getAllParticipants () {
      const cmsQuery = { 
          query : `
              query MyQuery {
                  participants(last: 250) {
                      id
                      name
                      alias                      
                      active
                      mail
                      phone
                      birthday
                  }
              }
      `};

      return (await baseGraphCMSFetch(cmsQuery))?.data?.participants;
  }

  async publishParticipant(id: string) {    
    const cmsQuery = {
        query: `
            mutation {
                publishParticipant(to:PUBLISHED, where:{id: "${id}"}) {
                    id
                }
            }
        `
    };

    return await baseGraphCMSFetch(cmsQuery);
  }
  
  async unpublishParticipant(id: string) {    
    const cmsQuery = {
        query: `
            mutation {
                unpublishParticipant(where:{id: "${id}"}) {
                    id
                }
            }
        `
    };

    return await baseGraphCMSFetch(cmsQuery);
  }

  async addParticipant(participant: Participant) {
    if (participant.name) {
      try {
        const cmsQuery = { 
            query : `
                mutation {
                    createParticipant(data: {
                      name: "${participant.name}",
                      alias: "${participant.alias}",
                      type: guest,
                      active: true,                      
                    }) { id }
                }
        `};

        var res = await baseGraphCMSFetch(cmsQuery);
       
        if (res?.errors?.[0]?.message.includes("not unique"))
          return -1;

        const newParticipant2 = {...participant, id: res?.data?.createParticipant?.id};
        await this.publishParticipant(newParticipant2?.id);

        return newParticipant2.id;
      }catch(error: any) {
        logErrors(`Erro ao adicionar o participante '${participant.name}'!`, error.toString());
        return null;
      }
      
    }
  }
  
  
  async delete(id: string) {
    try{
      if (id) {
        await this.unpublishParticipant(id);
        return true;
      }

      throw new Error("Id não preenchido.");
    }catch (error: any) {
      logErrors(`Erro ao excluir o participante de id '${id}'!`, error.toString());
      return false;
    }
    
  }

  async update(participant: Participant) {
    try {
      if (participant.id && participant.name) {
        const cmsQuery = { 
          query : `
              mutation {
                  updateParticipant(data: {
                    name: "${participant.name}",
                    alias: "${participant.alias}",
                    mail: "${participant.mail}",
                    phone: "${participant.phone}",
                    active: ${participant.active},
                    birthday: "${participant.birthday}"
                  }, where: {id: "${participant.id}"}) { id }
              }
        `};

        await baseGraphCMSFetch(cmsQuery);
        await this.publishParticipant(participant.id);
        return true;
      }

      throw new Error("Id, nome ou tipo não preenchidos.");
    }catch(error: any) {
      logErrors(`Erro ao atualizar o participante '${participant.name}'!`, error.toString());
      return false;
    }    
  }

}