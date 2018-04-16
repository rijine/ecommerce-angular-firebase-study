import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AuthComponent } from './containers/auth/auth.component';
import { SearchComponent } from './containers/search/search.component';
import { UploadsComponent } from './containers/uploads/uploads.component';
import { SecurityComponent } from './containers/security/security.component';
import { SaveComponent } from './containers/save/save.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SearchComponent,
    UploadsComponent,
    SecurityComponent,
    SaveComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NguiAutoCompleteModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
