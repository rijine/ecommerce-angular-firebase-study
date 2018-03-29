import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  email = '';
  pwd = '';
  phone = '+9198951232';
  codeConfirm = '';
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  confirmationResult;

  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'phone-sign-in-recaptcha'
    );
    this.recaptchaVerifier.render();

    /* window['phoneRecaptchaVerifier'] = new firebase.auth.RecaptchaVerifier(
      'phone-sign-in-recaptcha',
      {
        size: 'invisible',
        callback: function(response) {
          // reCAPTCHA solved - will proceed with submit function
        },
        'expired-callback': function() {
          // Reset reCAPTCHA?
        }
      }
    ); */
  }

  confirmPhoneNumber() {
    this.confirmationResult
      .confirm(this.codeConfirm)
      .then(res => {
        const user = res.user;
        console.log(user);
      })
      .catch(err => {
        console.log('Failed to sign in...');
      });
  }

  phoneNumberVerification() {
    this.afAuth.auth
      .signInWithPhoneNumber(this.phone, this.recaptchaVerifier)
      .then(conf => {
        this.confirmationResult = conf;
        console.log(conf);
      })
      .catch(function(n) {
        console.error(n, 'SMS not sent!!!');
      });

    /* const appVerifier = window['phoneRecaptchaVerifier'];
    this.afAuth.auth
      .signInWithPhoneNumber(this.phone, appVerifier)
      .then(function(confirmationResult) {
        const code = prompt(
          'We have send a code to ' + this.phone + ', please enter it here',
          ''
        );
        if (code) {
          confirmationResult
            .confirm(code)
            .then(function(result) {
              // User signed in successfully.
              // Reset reCAPTCHA?
              // ...
            })
            .catch(function(error) {
              // User couldn't sign in (bad verification code?)
              // Reset reCAPTCHA?
              // ...
            });
        }
      })
      .catch(function(error) {
        console.log(error.message);
      });*/
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
