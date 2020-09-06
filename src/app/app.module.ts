// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Internal imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

/**
 * Main module of the app
 * We could have all components declared in this single module (since the app is very small)
 * but we created some feature-level modules like we would do for a real-world app :
 *   - posts module
 *   - auth module
 * We also move all the Angular Material imports in a dedicated module
 */

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    /* Custom routing for our app */
    AppRoutingModule,
    HttpClientModule,
    /* Custom module grouping all Angular material modules */
    AngularMaterialModule,
    /* Custom module for all posts related logic */
    PostsModule,
    /* Custom module for auth operations */
    AuthModule
  ],
  providers: [
    // register our Auth interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
