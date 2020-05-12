import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'room/ed11', loadChildren: () => import('./room/room.module').then(m => m.RoomModule) },
  { path: '',   redirectTo: '/room/ed11', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
