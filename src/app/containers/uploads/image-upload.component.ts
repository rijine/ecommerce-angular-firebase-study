import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-image-upload',
  template: `
    <div class="card" style="padding: 10px">
      <div class="card-body">
        <!--<label class="btn btn-primary btn-sm">
          <input style="display: none" type="file" accept="image/*" (change)="onSelect($event)"/>
          Choose file
        </label>
        -->
        <label class="btn btn-primary btn-sm" *ngIf="!!image" (click)="onDelete()">
          Delete
        </label>
        <div class="progress">
          {{uploadPercent | async}}
        </div>
        <div *ngIf="!!url">
          <img [src]="url" style="width: 72px; height: auto" class="img-thumbnail" />
        </div>
      </div>
    </div>
  `
})
export class ImageUploadComponent {
  @Input() position: any;
  @Output() remove = new EventEmitter();
  private imageFile: any;
  url;
  filePath: string;
  uploadPercent: Observable<number>;
  downloadURL: string; // Observable<string>;
  task: AngularFireUploadTask;

  constructor(private storage: AngularFireStorage) {}

  get image() {
    return this.imageFile;
  }

  @Input()
  set image(image: any) {
    this.imageFile = image;
    console.log('Selected');
    this.readUrl();
  }

  public upload() {
    if (this.imageFile && !this.downloadURL) {
      this.filePath =
        'product-images/' +
        uuid() +
        this.imageFile.name.substr(this.imageFile.name.lastIndexOf('.'));
      this.task = this.storage.upload(this.filePath, this.imageFile);
      this.uploadPercent = this.task.percentageChanges();
      this.task.downloadURL().subscribe(url => {
        this.downloadURL = url;
      });
    }
  }

  public isUploaded() {
    return !!this.downloadURL;
  }

  readUrl() {
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.url = e.target.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onDelete() {
    this.remove.emit(this.position);
  }
}
