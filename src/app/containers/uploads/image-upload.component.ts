import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

declare var firebase: any;

interface Image {
  path: string;
  filename: string;
  downloadURL?: string;
  $key?: string;
}

@Component({
  selector: 'app-image-upload',
  template: `
    <div class="card" style="padding: 10px">
      <div class="card-body">
        <label class="btn btn-primary btn-sm">
          <input style="display: none" multiple type="file" accept="image/*" (change)="onFileSelect($event)"/>
          Choose file
        </label>
        <label class="btn btn-primary btn-sm" *ngIf="!!image" (click)="onDelete()">
          Delete
        </label>
      </div>
      {{ image? image.name : 'No file choosen' }}
      {{ image.uploadPercent }}
      {{ image.status }}
      <img [src]="image.downloadUrl" />
    </div>
  `
})
export class ImageUploadComponent {
  @Output() imageSelected = new EventEmitter();
  @Output() deleteClicked = new EventEmitter();
  @Input() image;
  @Input() position;
  url = '';

  onFileSelect($event) {
    console.log($event);
    if ($event.target.files.length > 0) {
      this.imageSelected.emit($event);
    }
    /* this.readUrl($event); */
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.url = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onDelete() {
    this.deleteClicked.emit(this.position);
  }
}
