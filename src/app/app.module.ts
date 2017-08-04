import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './account/auth.service';
import { AuthGuardService } from './account/auth-guard.service';
import { AppComponent } from './app.component';
import { SigninComponent } from './account/signin/signin.component';
import { SignupComponent } from './account/signup/signup.component';
import { AwsDashboardComponent } from './aws/aws-dashboard/aws-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    AwsDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [AuthService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
