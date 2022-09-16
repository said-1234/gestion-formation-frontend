import {Pays} from "./Pays";
import {Formations} from "./Formations";
import {Session} from "./Session";

export class Participants {
  id?: number;
  nom!: string ;
  prenom!: string ;
  email!: string ;
  tel?: number ;
  pays?:Pays;
  session?: Session;
}
