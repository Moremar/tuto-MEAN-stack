
         MEAN STACK TUTO
       ------------------


INTRODUCTION
------------

The MEAN stack is a set of technologies that lets us build full web applications :
M : MongoDB for data persistence
E : ExpressJS (NodeJS server side framework)
    It applies a succession of middlewares to incoming requests and send a response.
A : Angular for the front-end
N : NodeJS for the backend

A MEAN app is made of 2 independant apps running in parallel :
 - the Angular app that only serves the index.html file handling all the GUI
 - the Node app offering a REST API that the Angular app can call to interact with the backend
We can have either :
 - the 2 apps running on totally independant servers
 - a single server serving the Angular app on path "/" and the REST API on other paths


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

- Create new Angular project ;
     $>  ng new mean-tuto

- Open it in Visual Studio Code.
  If not installed yet, install the Extensions :
      - Angular Essentials  -> bundle of extensions for Angular parsing
      - Material Icon Theme -> better icons for each file type

- Angular Material
  Install and configure in our project (dowwnload node module, add the imports/links) with :
     $>  ng add @angular/material

- Node app
  The Node app could be created in a totally independant folder, but we create it in a "backend" folder
  at the same level as the "src" folder to keep things together.
  ~ create a server.js file in the root folder that contains the logic to start the Node server.
  ~ start the Node server with :
     $>  node server.js

- Nodemon
  The Node server needs to be restarted after every change to take it into account.
  We can use the Nodemon command to automatically restart the server at every change, so we can
  simply refresh our page in the browser to get the updated response.
     $>  npm install -g nodemon
     $>  npm install --save-dev nodemon
  Then start the server with :
     $>  nodemon server.js

- Express framework
     $>  npm install --save express
     $>  npm install --save body-parser     // middleware parsing POST/PUT body
  We create an app.js file under /backend that represents our Express app.
  In that file we define all the middleware of the app.
  It is imported and started from server.js.


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
