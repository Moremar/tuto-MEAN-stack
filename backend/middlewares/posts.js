// Internal includes
const Post = require('../models/post'); // Mongoose model for MongoDB Posts collections


/*
 * Custom middlewares for the /api/posts section
 * They are referenced from the router posts-routes.js
 */


// middleware to get all posts (no authentication required)
exports.getPosts = (request, response, _next) => {
    console.log('Middleware: GET ' + request.originalUrl);
    const mongoQuery = Post.find();

    // Use query parameters for pagination
    const pageIndex = +request.query.pageIndex;
    const pageSize = +request.query.pageSize;
    if (pageIndex !== undefined && pageSize !== undefined) {
        mongoQuery.skip(pageSize * pageIndex)
            .limit(pageSize);
    }

    // get all posts from MongoDB
    mongoQuery.then(
        (posts) => {
            Post.countDocuments().then(
                (total) => {
                    response.status(200).json({
                        message: 'Retrieved posts successfully.',
                        posts: posts,
                        total: total
                    });
                }
            );
        }
    ).catch(
        (error) => {
            response.status(500).json({
                message: "Failed to get the posts from the server."
            });
        }
    );
};


// middleware to get a single post (no authentication required)
exports.getPost = (request, response, _next) => {
    const postId = request.params.id;
    console.log('Middleware: GET /api/posts/' + postId);
    // get the post from MongoDB
    Post.findOne({ _id: postId })
        .then(
            (post) => {
                response.status(200).json({
                    message: 'Retrieved post successfully.',
                    post: post
                });
            }
        ).catch(
            (error) => {
                response.status(500).json({
                    message: "Failed to get post " + postId + " from the server."
                });
            }
        );
};


// middleware for the post creation (authentication required, handled in posts-routes.js)
exports.createPost = (request, response, _next) => {
    console.log('Middleware: POST /api/posts');
    console.log(request.body);

    // build image path
    const serverUrl = request.protocol + '://' + request.get('host');
    const imagePath = serverUrl + '/images/' + request.file.filename; // request.file is made available by Multer

    const post = new Post({
        // take user info from the decoded token (so it can not be altered)
        userId: request.auth.userId,
        username: request.auth.username,
        // take post info from the request
        title: request.body.title,
        content: request.body.content,
        imagePath: imagePath
    });

    // save in MongoDB in the current database in collection called "posts" (lower-case plurial name of the model)
    console.log('Creating new post in MongoDB Posts collection :\n' + post);
    post.save()
        .then(
            (createdPost) => {
                // send the response containing the posts
                response.status(200).json({
                    message: 'Created post successfully.',
                    post: createdPost
                });
            }
        ).catch(
            (error) => {
                response.status(500).json({
                    message: "Failed to create the post on the server."
                });
            }
        );
};


// middleware to edit a post (authentication required, handled in posts-routes.js)
exports.editPost = (request, response, _next) => {
    const postId = request.params.id;
    console.log('Middleware: PUT /api/posts/' + postId);
    console.log(request.body);

    // check that the post exists and is owned by the authenticated user
    Post.findOne({ _id: postId }).then(
        (post) => {
            // post must exist
            if (!post) {
                return response.status(404).json({
                    message: 'ERROR - No post with ID ' + postId,
                    post: null
                });
            }
            // post must belong to authenticated user
            if (post.userId != request.auth.userId) {
                return response.status(401).json({
                    message: 'ERROR - Post with ID ' + postId + ' belongs to another user.',
                    post: null
                });
            }

            // build image path
            let imagePath;
            if (request.file) {
                // use the URL of the new file created on the server by Multer
                const serverUrl = request.protocol + '://' + request.get('host');
                imagePath = serverUrl + '/images/' + request.file.filename; // request.file is made available by Multer
            } else {
                // use the URL in the post
                imagePath = request.body.imagePath;
            }

            // update a post in MongoDB
            Post.findByIdAndUpdate({ _id: postId }, {
                    title: request.body.title,
                    content: request.body.content,
                    imagePath: imagePath
                })
                .then((updatedPost) => {
                    response.status(200).json({
                        message: 'Updated post successfully.',
                        post: updatedPost
                    });
                });
        });
};


// middleware to delete a post (authentication required, handled in posts-routes.js)
exports.deletePost = (request, response, _next) => {
    const postId = request.params.id;
    console.log('Middleware: DELETE /api/posts/' + postId);

    Post.findOne({ _id: postId })
        .then(
            (post) => {
                // post must exist
                if (!post) {
                    throw {
                        code: 404,
                        error: 'No post with ID ' + postId
                    };
                }
                // post must belong to authenticated user
                if (post.userId != request.auth.userId) {
                    throw {
                        code: 401,
                        error: 'Post with ID ' + postId + ' belongs to another user.'
                    };
                }
                // perform deletion
                return Post.deleteOne({ _id: postId });
            }
        ).then(
            (_deletionResult) => {
                return response.status(200).json({
                    message: 'Deleted post successfully.',
                    id: postId
                });
            }
        ).catch(
            (e) => {
                return response.status(e.code).json({
                    message: e.error,
                    post: null
                });
            }
        );
};