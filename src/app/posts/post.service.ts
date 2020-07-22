// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Internal imports
import { Post } from './model/post.model';
import { RestGetPostsResponse, RestPostPostsResponse, RestDeletePostResponse } from './model/rest-posts.model';


@Injectable({
    providedIn: 'root'
})
export class PostService {

  private POSTS_URL = 'http://localhost:3000/api/posts';

  // private Subject to prevent to next() from outside this class
  private postsChanged = new Subject<Post[]>();

  constructor(private http: HttpClient) {}


  // postsChanged is private, so we only expose an observable version of it (that cannot call next())
  getPostsObservable(): Observable<Post[]> {
    return this.postsChanged.asObservable();
  }

  
  // create a new post in the backend and refresh the posts list
  createPost(title: string, content: string): void {
    console.log("Creating post " + title + " / " + content);
    this.http.post<RestPostPostsResponse>(this.POSTS_URL, new Post(title, content))
        .subscribe((restResponse: RestPostPostsResponse) => {
          console.log('Receiving from POST ' + this.POSTS_URL);
          console.log(restResponse);
          // force to refetch the posts so other parts of the code get the change
          this.fetchPosts();
        });
  }

  // delete a post in the backend and refresh the posts list
  deletePost(postId: string): void {
    console.log('Deleting post ' + postId);
    this.http.delete<RestDeletePostResponse>(this.POSTS_URL + "/" + postId)
        .subscribe( (restResponse: RestDeletePostResponse) => {
          console.log('Receiving from DELETE ' + this.POSTS_URL + '/' + postId);
          console.log(restResponse);
          // force to refetch the posts so other parts of the code get the change
          this.fetchPosts();
        });
  }

  // refresh the posts list from the backend
  fetchPosts(): void {
    this.http.get<RestGetPostsResponse>(this.POSTS_URL)
        .pipe(
          // reshape the data from the backend to turn it into a list of Post elements
          // following the model of the front end (rename _id to id)
          map( (mongoPosts: RestGetPostsResponse) => {
            console.log('Receiving from GET ' + this.POSTS_URL);
            console.log(mongoPosts);
            return mongoPosts.posts.map( post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id
              };
            })
          }
        ))
        // subcribe to the new Post array to update the GUI with it
        .subscribe((posts: Post[]) => {
          this.postsChanged.next(posts);
        });
  }
}
