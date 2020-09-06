// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Internal imports
import { AngularMaterialModule } from '../angular-material.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';


/**
 * Module for posts related logic
 */

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent
  ],
  imports: [
    CommonModule, /* required for ng-if, etc... (instead of BrowserModule in the main module) */
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class PostsModule { }
