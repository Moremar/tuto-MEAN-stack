// Packages from NPM
const express = require('express');

// create the express app
const app = express();

// add a middleware for the /api/posts path
app.use('/api/posts',
    (request, response, next) => {
        posts = [
            {id: '1', title: 'post1', content: 'My post1 content'},
            {id: '2', title: 'post2', content: 'My post2 content'},
        ];
        // send the response containing the posts
        // no call to next() since the processing is finished here, no other middleware needs to be applied
        response.status(200).json({
            message: 'Retrieved posts successfully.',
            posts: posts
        });
    }
);

// Add a default middleware
app.use(
    (request, response, _next) => {
        console.log('Request received in the default middleware.');
        response.send("The requests matches no known path.");
    }
);

// export the Express app to be used in server.js
module.exports = app;
