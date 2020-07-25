// REST reprensetation of a post fetched from the the backend
export interface RestPost {
    _id: string;
    title: string;
    content: string;
    imagePath: string;
}

// REST response from the backend on GET /api/posts
export interface RestGetPostsResponse {
    message: string;
    posts: RestPost[];
}

// REST response from the backend on GET /api/posts/:id
export interface RestGetPostResponse {
    message: string;
    post: RestPost;
}

// REST response from the backend on POST /api/posts
export interface RestPostPostResponse {
    message: string;
    post: RestPost;
}

// REST response from the backend on PUT /api/posts/:id
export interface RestPutPostResponse {
    message: string;
    post: RestPost;
}

// REST response from the backend on DELETE /api/posts/:id
export interface RestDeletePostResponse {
    message: string;
    id: string;
}
