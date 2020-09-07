
         MEAN STACK TUTO
       ------------------


INTRODUCTION
------------

The MEAN stack is a set of technologies that lets us build full web applications :
M : MongoDB for data persistence (No SQL database)
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
     $>  nodemon server.js --config nodemon.json
  The nodemon.json file is used to pass some options to Nodemon.
  In this app, we use it to pass some global variables, that would be different for dev or prod env.
  This is done with the "env" options.

- Express framework
     $>  npm install --save express
     $>  npm install --save body-parser     // middleware parsing POST/PUT body
  We create an app.js file under /backend that represents our Express app.
  In that file we define all the middleware of the app.
  It is imported and started from server.js.

- MongoDB
  ~ Windows :
    Download from their website https://www.mongodb.com/
    This installs MongoDB Compass (MongoDB GUI)
    Create a new database on localhost:27017
    We can then create collections in it and add documents.
  ~ MacOS with Homebrew :
    $>  brew tap mongodb/brew                        // get MongoDB tap
    $>  brew install mongodb-community@4.2           // install MongoDB from their tap
    $>  brew services start mongodb-community@4.2    // start the MongoDB server (mongod)
  ~ We can also use MongoDB Atlas (free cloud sandbox provided by MongoDB)
     - Create an account from their website
     - Click "create cluster"
     - Select AWS and pick all the free options then click "Create"
     - it takes 3min to create the cluster
     - Under "Database Access" create a user (login/password) with Atlas Admin privilege
     - Under "Network Access" add our current IP address (where our Node.js app is running)
     - We can then connect it from MongoDB Compass GUI, from the shell of from our app.
  ~ Angular MongoDB packages
    $>  npm install --save mongodb       // default package for MongoDB (we are not using it here)
    $>  npm install --save mongoose      // schema-oriented Node.js package for MongoDB
    $>  npm install --save mongoose-unique-validator

- File upload
  ~ Uploading files from Angular to Node.js requires Multer package in the Node code :
    $>  npm install --save multer

- Password encryption
  We use the bcrypt package to create a hash for user passwords :
    $>  npm install --save bcrypt

- JWT (Json Web Token) for authentication tokens
    $>  npm install --save jsonwebtoken


START THE APP
-------------

  $> npm install                                 // install locally all modules from package.json
  $> nodemon server.js --config nodemon.json     // start backend (nodemon.json for env variables)
  $> ng serve -o                                 // start frontend


ANGULAR
-------

The front-end of the MEAN app is based on Angular, running on the client browser.
See Angular tuto for details.


Node.js + Express
-----------------

The backend of the MEAN app is based on Node.js, running on the server.
It uses Express framework to manage the REST API.
Express receives some queries and send them to a sequence of middleware.
Each middleware can either respond to the query or enrich it and send it to the next middleware.
We use some specific middleware for each route that the REST API supports.
These routes can either be handled directly from the main file (with app.use() / app.get() ...) or
grouped per API section into a router in a dedicated files and imported with app.use(router).

~ File upload
  We can use Multer middleware to upload files in Node.js :
  https://github.com/expressjs/multer

~ Authentication
  In Single-page application, we cannot use sessions so we use a token for authentication.
  On login, the server sends a token to the client.
  This token then needs to be attached to all requests from the client to the server.
  The server validates that the token is correct before processing the request.
  We use JWT (Json Web Token) for the tokens : https://jwt.io/
  The token is valid only a short period of time (1h here) and after expiration the user must login again.

~ Controllers
  In the routes files, we associate an endpoint URL with a middleware function to execute.
  The middleware function can be anonymously defined directly in the routes file, or created
  in a controller file and referenced in the routes file (to make it more readable).


MongoDB
-------

NoSQL database storing collections of documents in JSON format.
We will access it with Mongoose, a NodeJS module above the official MongoDB driver that lets us
easily create collection schemas and represent documents with Javascipt objects.

For each collection in MongoDB we want to interact with, we create a file and export the model for that collection (made
of the collection name and the collection schema), see backend/models/post.js for example.

From the app.js code, we connect Mongoose to the running MongoDB database, and then use the model to save documents.


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
    ~ MatDialogModule for dynamic popups
 - input components must be wrapped into <mat-form-field> and get the matInput property.
