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
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {
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

  private products: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.products = db.collection('products');
  }

  ngOnInit() {}

  addProduct() {
    this.products.add(this.product);
  }
}
