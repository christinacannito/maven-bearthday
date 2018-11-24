import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BirthdayFormComponent } from './birthday-form/birthday-form.component';
// import { ResultsComponent } from './results/results.component';
import { ErrorComponent } from './error/error.component';
import { SavedComponent } from './saved/saved.component';

const routes: Routes = [
  {path: '', component: BirthdayFormComponent},
  {path: 'savedImages', component: SavedComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
