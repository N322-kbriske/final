import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToastController } from '@ionic/angular';
import { timeStamp } from 'console';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {
  public firstName: string;
  public currentUser: any = {};
  public fName: string;
  public lName: string;
  public allPeople = JSON.parse(localStorage.getItem('Person'));
  public grade: string;
  public backupUser: any = {};

  handlerMessage = '';
  roleMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async presentToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: position,
      buttons: [
        {
          text: 'Undo',
          role: 'cancel',
          handler: () => {
            this.redo();
          },
        },
      ],
    });

    await toast.present();
  }

  async presentToastNoOption(
    message: string,
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: position,
    });

    await toast.present();
  }

  redo() {
    this.backupUser = this.auth.backupUser;
    this.currentUser = this.backupUser;

    const idx = this.allPeople.findIndex((person) => {
      return person.id === this.currentUser.id;
    });

    this.allPeople[idx] = this.currentUser;
    this.saveUser();
    window.location.reload();
  }

  update(fName: string, lName: string, grade: string) {
    if (fName != null && lName != null && grade != null) {
      let editPerson = {
        id: this.currentUser.id,
        firstName: fName,
        lastName: lName,
        grade: grade,
      };

      this.currentUser = editPerson;
      console.log(this.currentUser);

      const idx = this.allPeople.findIndex((person) => {
        return person.id === this.currentUser.id;
      });

      console.log(idx, this.allPeople[idx]);
      this.allPeople[idx] = editPerson;
      this.saveUser();
      this.currentUser = {};

      this.fName = '';
      this.lName = '';
      this.grade = '';

      this.router.navigateByUrl('/home', { replaceUrl: true });

      this.presentToast('User updated', 'bottom');
    } else {
      this.presentToastNoOption('Please update or cancel', 'top');
    }
  }

  cancelEdit() {
    this.currentUser = {};
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  getCurrentUser() {
    this.currentUser = this.auth.currentUser;
    // this.currentUser.id = this.auth.currentUser.id;
    console.log(this.currentUser);
  }

  saveUser() {
    localStorage.setItem('Person', JSON.stringify(this.allPeople));
  }

  ngOnInit() {
    this.getCurrentUser();
  }
}
