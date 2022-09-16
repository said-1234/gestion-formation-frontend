import {Formateurs} from "./Formateurs";
import {Formations} from "./Formations";
import {Participants} from "./Participants";

export class Session {
  sessionId?:number;
  lieu!: string ;
  dateDebut?: Date ;
  dateFin?: Date ;
  nbParticipants?: number ;
  formateur?: Formateurs ;
  formation?: Formations;
  participant?: Participants;

}
