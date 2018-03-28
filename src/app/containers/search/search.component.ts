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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  filterField = '';

  items: Observable<any[]>;
  userInfo: Observable<any[]>;
  prodcutList: Observable<any[]>;
  private products: AngularFirestoreCollection<any>;
  private users: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.items = db.collection('categories').valueChanges();
    this.userInfo = db.collection('users').valueChanges();
    this.prodcutList = db.collection('products').valueChanges();
    this.products = db.collection('products');
    this.users = db.collection('users');
  }

  ngOnInit() {}

  search1() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('products', ref =>
          ref
            .where('category', '==', 'Agriculture')
            .orderBy('name')
            .startAt(this.filterField)
        )
        .valueChanges()
    );

    queryObservable.subscribe(items => {
      console.log(items);
    });

    query$.next();
  }

  search2() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('products', ref =>
          ref
            .where('category', '==', 'Agriculture')
            .where('subCategory', '==', 'Fruits')
            .orderBy('name')
            .startAt('abcd')
        )
        .valueChanges()
    );

    queryObservable.subscribe(items => {
      console.log(items);
    });

    query$.next();
  }

  search3() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(
      () =>
        this.db
          .collection('users', ref => ref.orderBy('name').startAt('Rubber'))
          .valueChanges()
      // .where('category', '==', 'Rubber')
    );

    queryObservable.subscribe(items => {
      console.log(items);
    });

    query$.next();
  }
}
