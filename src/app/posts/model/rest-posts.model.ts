// REST reprensetation of a post fetched from the the backend
export interface RestPost {
    _id: string;
    title: string;
    content: string;
}

// REST response from the backend on GET posts
export interface RestGetPostsResponse {
    message: string;
    posts: RestPost[];
}

// REST response from the backend on POST posts
export interface RestPostPostsResponse {
    message: string;
    post: RestPost;
}

// REST response from the backend on DELETE post
export interface RestDeletePostResponse {
    message: string;
    id: string;
}
