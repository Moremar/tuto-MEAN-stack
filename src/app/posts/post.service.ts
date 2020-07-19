// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
// Internal imports
import { Post } from './model/post.model';
import { RestGetPostsResponse, RestPostPostsResponse } from './model/rest-posts.model';


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
    this.http.post<RestPostPostsResponse>(this.POSTS_URL, new Post(title, content))
        .subscribe((restResponse) => {
          console.log('Receiving from POST ' + this.POSTS_URL);
          console.log(restResponse);
          // force to refetch the posts so other parts of the code get the change
          this.fetchPosts();
        });
  }


  // refresh the posts list from the backend
  fetchPosts(): void {
    this.http.get<RestGetPostsResponse>(this.POSTS_URL)
        .subscribe((restResponse) => {
          console.log('Receiving from GET ' + this.POSTS_URL);
          console.log(restResponse);
          this.postsChanged.next(restResponse.posts);
        });
  }
}
