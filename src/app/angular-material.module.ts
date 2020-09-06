import { NgModule } from '@angular/core';
import { MatInputModule, MatCardModule,
  MatButtonModule, MatToolbarModule,
  MatExpansionModule, MatProgressSpinnerModule,
  MatPaginatorModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Module to group all the Angular Material modules needed by the app
 * That is not required but it makes the main module easier to read
 */

@NgModule({
  declarations: [],
  imports: [
    /* Angular Material modules */
    BrowserAnimationsModule,    /* added by : ng add @angular/material */
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  exports: [
    /* export the same list of modules to make them available to the main module */
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ]
})
export class AngularMaterialModule { }
