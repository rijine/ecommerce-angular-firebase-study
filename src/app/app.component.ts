import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  email = '';
  pwd = '';
  filterField = '';

  product = {
    _url: 'Procut2',
    name: 'name12',
    title: 'title',
    desc: 'desc',
    unit: 'unit',
    minQty: '10',
    images: [
      {
        imagePath: 'url to path',
        desc: 'desc',
        thumbPath: 'url'
      }
    ],
    exporterId: '598419db84c0df1ec531b6e1',
    category: 'Agriculture',
    subCategory: 'Sub Category',
    item: 'Item'
  };

  items: Observable<any[]>;
  userInfo: Observable<any[]>;
  prodcutList: Observable<any[]>;
  private products: AngularFirestoreCollection<any>;

  // auth

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.items = db.collection('categories').valueChanges();
    this.userInfo = db.collection('users').valueChanges();
    this.prodcutList = db.collection('products').valueChanges();
    this.products = db.collection('products');
  }

  addProduct() {
    this.products.add(this.product);
  }

  search1() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('products', ref =>
          ref.where('category', '==', 'Agriculture')
          .orderBy('name')
          .startAt(this.filterField)
        )
        .valueChanges()
    );

    queryObservable.subscribe( (items) => {
      console.log(items);
    });

    query$.next();
  }

  search2() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('products', ref =>
          ref.where('category', '==', 'Agriculture')
          .where('subCategory', '==', 'Fruits')
          .orderBy('name')
          .startAt('abcd')
        )
        .valueChanges()
    );

    queryObservable.subscribe( (items) => {
      console.log(items);
    });

    query$.next();
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
