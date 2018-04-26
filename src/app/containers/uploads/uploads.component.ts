import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChildren
} from '@angular/core';
import { v4 as uuid } from 'uuid';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';

import {
  AngularFireStorage,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { andObservables } from '@angular/router/src/utils/collection';
import { ImageUploadComponent } from './image-upload.component';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  images: any = [false];
  @ViewChildren(ImageUploadComponent) uploadComponents = [];

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  onImageSelection(event) {
    for (const file of event.target.files) {
      this.images = [ new ImageItem(file), ...this.images];
    }
  }

  onRemoveImage(position) {
    this.images.splice(position, 1);
  }

  uploadAll() {
    for (const image of this.images) {
      if (image) {
        image.upload(this.storage);
      }
    }
    // this.uploadComponents[0].hide();
    /* const tasks: Observable<any>[] = [];
    for (const image of this.images) {
      if (image) {
        const filePath =
          'product-images/' +
          uuid() +
          image.name.substr(image.name.lastIndexOf('.'));
        const task = this.storage.upload(filePath, image);
        tasks.push(task.snapshotChanges());
        tasks.push(task.downloadURL());
        // this.uploadPercent = task.percentageChanges();
        // get notified when the download URL is available
        // this.downloadURL = task.downloadURL();
      }
    }*/
    /*    forkJoin(...tasks).subscribe((res) => {
      console.log(res);
    }); */
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath =
      'product-images/' + uuid() + file.name.substr(file.name.lastIndexOf('.'));
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    this.downloadURL = task.downloadURL();
  }
}

export class ImageItem {
  file: any;
  status: number;
  filePath: string;
  uploadTask: AngularFireUploadTask;
  downloadUrl: any;
  uploadPercent: any;
  constructor(file: any) {
    this.status = 1;
    this.file = file;
    this.filePath =
      'product-images/' + uuid() + file.name.substr(file.name.lastIndexOf('.'));
  }

  upload(storage: any) {
    this.uploadTask = storage.upload(this.filePath, this.file);
    this.uploadPercent = this.uploadTask.percentageChanges();
    this.downloadUrl = this.uploadTask.downloadURL();
    return this.uploadTask.snapshotChanges();
  }
}
