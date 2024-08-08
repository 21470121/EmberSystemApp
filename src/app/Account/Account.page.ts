// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AccountService } from '../services/account.service';


// @Component({
//   selector: 'app-Account',
//   templateUrl: 'Account.page.html',
//   styleUrls: ['Account.page.scss']
// })
// export class AccountPage implements OnInit {


//   constructor(private accountService: AccountService) {}

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-Account',
  templateUrl: './Account.page.html',
  styleUrls: ['./Account.page.scss']
})
export class AccountPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private accountService: AccountService, private toastController: ToastController) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.accountService.login({ username, password }).subscribe((response: any) => {
        if (response) {
          this.presentToast('Logged in successfully!');
        } else {
          this.presentToast('Invalid username or password');
        }
      });
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}