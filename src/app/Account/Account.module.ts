import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountPage } from './Account.page';

import { AccountPageRoutingModule } from './Account-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AccountPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
