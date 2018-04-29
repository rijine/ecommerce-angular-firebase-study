import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  filterField = '';
  selected = '';

  items: Observable<any[]>;
  userInfo: Observable<any[]>;
  prodcutList: Observable<any[]>;
  private products: AngularFirestoreCollection<any>;
  private users: AngularFirestoreCollection<any>;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    public dataService: DataService
  ) {
    this.items = db.collection('categories').valueChanges();
    this.userInfo = db.collection('users').valueChanges();
    this.prodcutList = db.collection('products').valueChanges();
    this.products = db.collection('products');
    this.users = db.collection('users');
  }

  observableSource = (keyword: any): Observable<any[]> => {
    return this.db
      .collection('categories', ref =>
        ref
          .where('type', '==', 'category')
          .where('factory', '==', 1)
          .orderBy('name')
          .startAt(this.selected)
          .limit(5)
      )
      .valueChanges();
  };

  ngOnInit() {
    this.dataService.init('categories', 'name', {
      reverse: false,
      prepend: false
    });
  }

  scrollHandler(e) {
    console.log(e);
    if (e === 'bottom') {
      this.dataService.more();
    }
  }

  loadMoreCategories() {
    this.dataService.more();
  }

  search1() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(
      () =>
        this.db
          .collection('categories', ref =>
            ref
              .where('category', '==', 'gems, jewellery and diamonds')
              .where('type', '==', 'subcategory')
              .where('factory', '==', 1)
              .orderBy('name')
              .startAt(this.filterField)
              .limit(5)
          )
          .valueChanges()
      /* this.db
        .collection('products', ref =>
          ref
            .where('category', '==', 'Agriculture')
            .orderBy('name')
            .startAt(this.filterField)
        )
        .valueChanges() */
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
          .collection('users', ref => ref)
          .valueChanges()
    );

    queryObservable.subscribe( (items => {
      console.log(items);
      /* this.db
          .collection('users/' , ref => ref)
          .valueChanges(); */
    });

    query$.next();
  }

  search4() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('products', ref =>
          ref.orderBy('name').startAt(this.filterField)
        )
        .valueChanges()
    );

    queryObservable.subscribe(items => {
      console.log(items);
    });

    query$.next();
  }

  search5() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('users', ref =>
          ref.orderBy('item').startAt(this.filterField)
        )
        .valueChanges()
    );

    queryObservable.subscribe(items => {
      console.log(items);
    });

    query$.next();
  }

  searchStories() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('stories', ref =>
          // ref.where('status', '>=', 1) // error due to rules
          ref.where('status', '>=', 2)
        )
        .valueChanges()
    );

    queryObservable.subscribe(items => {
      console.log(items);
    });

    query$.next();
  }

  searchCategories() {
    const query$ = new Subject();
    const queryObservable = query$.switchMap(() =>
      this.db
        .collection('categories', ref =>
          ref.orderBy('category').startAt(this.filterField)
        )
        .valueChanges()
    );

    queryObservable.subscribe(items => {
      console.log(items);
    });

    query$.next();
  }
}
