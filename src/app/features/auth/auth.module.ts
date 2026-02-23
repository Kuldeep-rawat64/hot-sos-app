import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PinLogin } from './pin-login/pin-login';

const routes: Routes = [{ path: '', component: PinLogin }];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), PinLogin],
})
export class AuthModule {}
