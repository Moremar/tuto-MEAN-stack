
         MEAN STACK TUTO
       ------------------


INTRODUCTION
------------

The MEAN stack is a set of technologies that lets us build full web applications :
M : MongoDB for data persistence
E : ExpressJS (NodeJS server side framework)
A : Angular for the front-end
N : NodeJS for the backend


SETUP
-----

- Install NodeJS from nodejs.org (containing NPM).
  If already installed, get the latest stable version :
     $>  sudo npm install npm@latest -g
     $>  sudo npm install n -g
     $>  sudo n stable

- Install Angular CLI :
     $>  npm install @angular/cli -g
  If already installed, update it to the latest version :
     $>  npm outdated -g
     $>  npm update -g

- Create new project ;
     $>  ng new mean-tuto

- Open it in Visual Studio Code.
  If not installed yet, install the Extensions :
      - Angular Essentials  -> bundle of extensions for Angular parsing
      - Material Icon Theme -> better icons for each file type

- Angular Material
  Install and configure in our project (dowwnload node module, add the imports/links) with :
     $>  ng add @angular/material


ANGULAR
-------

The front-end of the MEAN app is based on Angular.
See Angular tuto for details.


TOOLS
-----

Angular Material
----------------
 - Pre-defined set of Angular components (form inputs, buttons, menus ...)
 - based on Google Material Design
 - official doc :   https://material.angular.io/
 - split into several modules per family of components, we must import the one we want to use :
    ~ MatToolbarModule for header toolbar
    ~ MatInputModule for form inputs
    ~ MatButtonModule for buttons
    ~ MatCardModule for card container components
    ~ MatExpansionModule for expansible components
 - input components must be wrapped into <mat-form-field> and get the matInput property.
