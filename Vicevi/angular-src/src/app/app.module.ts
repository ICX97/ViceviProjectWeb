import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import { AlertModule } from 'ngx-alerts';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthGuard} from './guard/auth.guard';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { JokesComponent } from './components/jokes/jokes.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { JokeService } from './services/joke.service';
import { EditJokeComponent } from './components/jokes/edit-joke/edit-joke.component';
import { DeleteJokeComponent } from './components/jokes/delete-joke/delete-joke.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { BestJokeComponent } from './components/best-joke/best-joke.component';

const appRoutes: Routes =  [

  {path:'', component: HomeComponent},
  {path:'jokes', component: JokesComponent, canActivate:[AuthGuard]},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'user/:username', component: PublicProfileComponent, canActivate:[AuthGuard]},
  {path: 'edit-joke/:id',component: EditJokeComponent, canActivate:[AuthGuard]},
  {path: 'delete-joke/:id',component: DeleteJokeComponent, canActivate:[AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    JokesComponent,
    EditJokeComponent,
    DeleteJokeComponent,
    PublicProfileComponent,
    BestJokeComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    AlertModule.forRoot({maxMessages: 5, timeout: 5000})
  ],
  providers: [JokeService,ValidateService, AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }