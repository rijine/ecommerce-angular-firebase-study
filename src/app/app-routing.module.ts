import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './containers/search/search.component';
import { AuthComponent } from './containers/auth/auth.component';
import { SecurityComponent } from './containers/security/security.component';
import { SaveComponent } from './containers/save/save.component';
import { UploadsComponent } from './containers/uploads/uploads.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'security',
    component: SecurityComponent
  },
  {
    path: 'save',
    component: SaveComponent
  },
  {
    path: 'uploads',
    component: UploadsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
