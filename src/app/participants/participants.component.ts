import { Participants } from '../model/Participants';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParticipantsService } from '../shared/service/participants.service';
import { Pays } from '../model/Pays';
import { PaysService } from '../shared/service/pays.service';
import { Formations } from '../model/Formations';
import { FormationsService } from '../shared/service/formations.service';
import { SessionService } from '../shared/service/session.service';
import { Session } from '../model/Session';

let PARTICIAPANTS: Participants[] = [];

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit {
  openpopup: boolean = false;
  ParticipantGroup!: FormGroup;
  ParticipantForm!: Participants;
  displayAffect: boolean = false;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  title!: string;
  participants!: Participants[];
  participant!: Participants;
  paysList: Pays[] = [];
  formationList: Formations[] = [];
  sessionList: Session[] = [];
  nomControl = new FormControl('', [Validators.required]);
  prenomControl = new FormControl('', [Validators.required]);
  telControl = new FormControl('', [Validators.required]);
  paysControl = new FormControl('', [Validators.required]);
  sessionControl = new FormControl('', [Validators.required]);

  constructor(
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private paysService: PaysService,
    private participantsService: ParticipantsService,
    private messageService: MessageService,
    private sessionService: SessionService
  ) {
    this.ParticipantGroup = this.formBuilder.group({
      nomControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      prenomControl: ['', Validators.required],
      telControl: ['', Validators.required],
      paysControl: ['', Validators.required],
      sessionControl: [''],
    });
    this.ParticipantForm = {
      id: undefined,
      nom: '',
      prenom: '',
      email: '',
      tel: undefined,
      pays: undefined,
      session: undefined,
    };
  }

  ngOnInit(): void {
    this.getAllParticipants();
  }

  getAllParticipants() {
    return this.participantsService.getAllParticipants().subscribe((data) => {
      this.participants = data;
      console.log(data);
      PARTICIAPANTS = this.participants;
    });
  }
  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.libelle === o2.libelle : o2 === o2;
  }
  AffectParticipant(participant: Participants) {
    if (this.openpopup) {
      this.openpopup = false;
      this.openpopup = true;
    } else {
      this.openpopup = true;
    }
    this.title = 'Affecter Participant';
    this.participant = { ...participant };
    this.displayEdit = false;
    this.displayAdd = false;
    this.displayAffect = true;
    this.ParticipantGroup = this.formBuilder.group({
      nomControl: [this.participant.nom, Validators.required],
      emailControl: [
        this.participant.email,
        [Validators.required, Validators.email],
      ],
      prenomControl: [this.participant.prenom, Validators.required],
      telControl: [this.participant.tel, Validators.required],
      paysControl: [this.participant.pays],
      sessionControl: [this.participant.session],
    });
    this.getAllSession();
  }
  editParticipant(participant: Participants) {
    if (this.openpopup) {
      this.openpopup = false;
      this.openpopup = true;
    } else {
      this.openpopup = true;
    }
    this.title = 'Modifier Participant';
    this.participant = { ...participant };
    this.displayAffect = false;
    this.displayEdit = true;
    this.displayAdd = false;
    this.ParticipantGroup = this.formBuilder.group({
      nomControl: [this.participant.nom, Validators.required],
      emailControl: [
        this.participant.email,
        [Validators.required, Validators.email],
      ],
      prenomControl: [this.participant.prenom, Validators.required],
      telControl: [this.participant.tel, Validators.required],
      paysControl: [this.participant.pays!.libelle, Validators.required],
    });
    this.getAllSession();
    this.getAllPays();
  }

  deleteParticipant(participant: Participants) {
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer le participant ' + participant.nom + '?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (participant.id != null) {
          this.participantsService
            .deleteParticipant(participant.id)
            .subscribe((data) => {
              if (JSON.stringify(data.message == 'success')) {
                this.participants = this.participants.filter(
                  (val) => val.id !== participant.id
                );

                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: data.message,
                  life: 1000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Probl??me de suppression',
                  detail: data.message,
                });
              }
            });
        }
      },
    });
  }

  addParticipant() {
    this.displayAffect = false;
    this.displayAdd = true;
    this.displayEdit = false;
    if (this.openpopup) {
      this.openpopup = false;
      this.openpopup = true;
    } else {
      this.openpopup = true;
    }
    this.ParticipantGroup = this.formBuilder.group({
      nomControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      prenomControl: ['', Validators.required],
      telControl: ['', Validators.required],
      paysControl: ['', Validators.required],
    });
    this.getAllSession();
    this.getAllPays();

    this.title = 'Ajouter Participant';
  }
  saveAffectParticipant(participant: Participants) {
    if (this.ParticipantGroup.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Probl??me d affectation de participant',
        detail: 'V??rifier votre formulaire',
      });
      return;
    }
    this.ParticipantForm.nom = this.f.nomControl.value;
    this.ParticipantForm.prenom = this.f.prenomControl.value;
    this.ParticipantForm.pays = this.f.paysControl.value;
    this.ParticipantForm.email = this.f.emailControl.value;
    this.ParticipantForm.tel = this.f.telControl.value;
    this.ParticipantForm.session = this.f.sessionControl.value;
    this.ParticipantForm.id = participant.id;
    console.log(this.ParticipantForm);
    this.participantsService.addParticipant(this.ParticipantForm).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Affecter participant',
          detail: 'Le participant est affect?? avec success',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Probl??me ajout participant',
          detail: "Impossible d'ajouter le participant",
        });
      }
    );
    this.hideDialog();
    this.ngOnInit();
  }
  saveEditParticipant(participant: Participants) {
    if (this.ParticipantGroup.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Probl??me ajout participant',
        detail: 'V??rifier votre formulaire',
      });
      return;
    }
    this.ParticipantForm.nom = this.f.nomControl.value;
    this.ParticipantForm.prenom = this.f.prenomControl.value;
    this.ParticipantForm.pays = this.f.paysControl.value;
    this.ParticipantForm.email = this.f.emailControl.value;
    this.ParticipantForm.tel = this.f.telControl.value;
    this.ParticipantForm.id = participant.id;
    this.participantsService.addParticipant(this.ParticipantForm).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ajouter participant',
          detail: 'Le participant est ajout?? avec success',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Probl??me ajout participant',
          detail: "Impossible d'ajouter le participant",
        });
      }
    );
    this.hideDialog();
    this.ngOnInit();
  }

  // convenience getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } {
    return this.ParticipantGroup.controls;
  }

  saveNewParticipant() {
    if (this.ParticipantGroup.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Probl??me ajout participant',
        detail: 'V??rifier votre formulaire',
      });
      return;
    }
    this.ParticipantForm.nom = this.f.nomControl.value;
    this.ParticipantForm.prenom = this.f.prenomControl.value;
    this.ParticipantForm.email = this.f.emailControl.value;
    this.ParticipantForm.tel = this.f.telControl.value;
    this.ParticipantForm.pays = this.f.paysControl.value;

    console.log(this.ParticipantForm);
    this.participantsService.addParticipant(this.ParticipantForm).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ajouter participant',
          detail: 'le participant est ajout?? avec success',
        });
        this.participants = this.participants.filter((val) => {
          return true;
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Probl??me ajout participant',
          detail: "Impossible d'ajouter le participant",
        });
      }
    );
    this.hideDialog();
    this.ngOnInit();
  }

  hideDialog() {
    this.openpopup = false;
    this.displayEdit = false;
    this.displayAdd = false;
  }
  getAllPays() {
    this.paysService.getAllPays().subscribe((data) => {
      this.paysList = data;
    });
  }
  // getAllFormations(){
  //   this.formationService.getAllFormations().subscribe(data=>{
  //     this.formationList=data;
  //   })
  // }

  private getAllSession() {
    this.sessionService.getAllSession().subscribe((data) => {
      this.sessionList = data;
    });
  }
}
