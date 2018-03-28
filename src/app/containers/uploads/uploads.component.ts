import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';

import {
  AngularFireStorage,
  AngularFireUploadTask
} from 'angularfire2/storage';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'product-images/' + uuid();
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    this.downloadURL = task.downloadURL();
  }
}
