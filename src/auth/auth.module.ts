import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Third party modules.
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SharedModule } from "./shared/shared.module";

export const ROUTES: Routes = [
    {
        path: 'auth',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            // We do not need to import these modules(login & register),
            // they are lazy loaded and
            // are available when required.
            { path: 'login', loadChildren: './login/login.module#LoginModule'},
            { path: 'register', loadChildren: './register/register.module#RegisterModule'}
        ]
    }
];

export const firebaseConfig: FirebaseAppConfig = {
    apiKey: "AIzaSyC9R9ijI2GiNZ87EPMhBaM9HfjMU8XpQjA",
    authDomain: "myapp-38ffb.firebaseapp.com",
    databaseURL: "https://myapp-38ffb.firebaseio.com",
    projectId: "myapp-38ffb",
    storageBucket: "myapp-38ffb.appspot.com",
    messagingSenderId: "700602848861"
};

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(ROUTES),
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,
        AngularFireDatabaseModule,
      SharedModule.forRoot() // To avoid duplicate of a service.
    ]
})

export class AuthModule {}