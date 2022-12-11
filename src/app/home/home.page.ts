import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToastController } from '@ionic/angular';
import { timeStamp } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public fName: string;
  public lName: string;
  public allPeople = JSON.parse(localStorage.getItem('Person'));
  public grade: string;
  public currentUser: any = {};

  handlerMessage = '';
  roleMessage = '';

  @ViewChild(IonModal) modal: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // confirm() {
  //   this.modal.dismiss(this.fName, 'confirm');
  // }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.initPage();
  }

  async presentToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: position,
      // buttons: [
      //   {
      //     text: 'Confirm',
      //     role: 'info',
      //     handler: () => {
      //       this.handlerMessage = 'More Info clicked';
      //     },
      //   },
      //   {
      //     text: 'Dismiss',
      //     role: 'cancel',
      //     handler: () => {
      //       this.handlerMessage = 'Dismiss clicked';
      //     },
      //   },
      // ],
    });

    await toast.present();

    // const { role } = await toast.onDidDismiss();
    // this.roleMessage = `Dismissed with role: ${role}`;
  }

  initPage() {
    // console.log('init');
    if (localStorage) {
      let person = localStorage.getItem('Person');
      if (person) {
        // let peoples = JSON.parse(localStorage.getItem('Person'));
        console.log('persons');
      } else {
        localStorage.setItem('Person', '[]');
        // alert("No recipes added yet");
      }
    } else {
      console.log('No localStorage');
    }

    // if (localStorage) {
    //   let people = localStorage.getItem('User');
    //   if (people) {
    //     let persons = JSON.parse(localStorage.getItem('User'));
    //     console.log('persons');
    //   } else {
    //     localStorage.setItem('User', '[]');
    //     // alert("No people added yet");
    //   }
    // } else {
    //   console.log('No localStorage');
    // }
  }

  logOut() {
    this.auth.logOut();
    this.router.navigateByUrl('login', { replaceUrl: true });
  }

  submitData(fName: string, lName: string, grade: string) {
    console.log('submit');
    let person = {
      id: Date.now().toString(),
      firstName: fName,
      lastName: lName,
      grade: grade,
    };
    this.allPeople.push(person);
    this.saveUser();
    this.modal.dismiss(this.fName, 'confirm');

    // this.fName = '';
    // this.lName = '';
    // this.grade = '';

    this.presentToast('User added', 'bottom');
  }

  edit(user: any) {
    console.log();
    // this.currentUser.id = id;
    this.auth.currentUser = user;
    this.auth.backupUser = user;
    this.router.navigateByUrl('/update-user', { replaceUrl: true });

    // console.log('edit');
    // const idx = this.allPeople.findIndex((person) => {
    //   return person.id === id;
    // });
    // console.log(idx, this.allPeople[idx]);
    // this.currentUser = this.allPeople[idx];
  }

  delete(id: string) {
    console.log('delete');
    //! this is super useful for retrieving the index from an array of objects
    const idx = this.allPeople.findIndex((person) => {
      return person.id === id;
    });
    console.log(idx);
    this.allPeople.splice(idx, 1);
    console.log(this.allPeople);
    this.saveUser();
    this.presentToast('User deleted', 'bottom');
  }

  saveUser() {
    localStorage.setItem('Person', JSON.stringify(this.allPeople));
  }
}
