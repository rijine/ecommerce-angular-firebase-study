import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  email = '';
  pwd = '';

  items: Observable<any[]>;

  // auth

  constructor(db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.items = db.collection('categories').valueChanges();
  }

  register() {
    this.afAuth.auth
      .createUserWithEmailAndPassword(this.email, this.pwd)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
}
