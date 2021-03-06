import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  categories = [];
  countries = [];

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
  private categories$: AngularFirestoreCollection<any>;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.products = db.collection('products');
    this.categories$ = db.collection('categories');
  }

  ngOnInit() {
    this.http.get('./assets/data/category.json').subscribe((res: any) => {
      this.categories = res.categories;
    });

    this.http.get('./assets/data/countries.json').subscribe((res: any) => {
      this.countries = res;
    });
  }

  addProduct() {
    this.products.add(this.product);
  }

  addCountries() {
    this.countries.map(country => {
      console.log(country.name);
      this.db
        .doc('countries/' + country.name.toLowerCase().trim())
        .set({
          name: country.name.toLowerCase().trim(),
          dialCode: country.dial_code.toLowerCase(),
          code: country.code.toLowerCase(),
          factory: 1
        })
        .catch(() => {
          console.log(country.name);
        });
    });
  }

  addCategories() {
    /* this.categories.map(category => {
      this.categories$.add({
        name: category.name,
        link: category.link,
        type: 1,
        factory: 1
      });
      category.sub.map(subCategory => {
        this.categories$.add({
          name: subCategory,
          link: subCategory.split(' ').join('-'),
          type: 2,
          category: category.name,
          factory: 1
        });
      });
    }); */

    this.categories.map(category => {
      this.db
        .doc('categories/' + category.name.toLowerCase())
        .set({
          name: category.name.toLowerCase(),
          link: category.link.toLowerCase(),
          type: 'category',
          factory: true
        })
        .catch(err => {
          console.log(err);
        });
      category.sub
        .map(subCategory => {
          console.log(subCategory);
          this.db.doc('categories/' + subCategory.toLowerCase()).set({
            name: subCategory.toLowerCase(),
            link: subCategory
              .split(' ')
              .join('-')
              .toLowerCase(),
            type: 'subcategory',
            category: category.name.toLowerCase(),
            factory: true
          }).catch(err => {
            console.log(err);
          });
        });

    });
  }
}
