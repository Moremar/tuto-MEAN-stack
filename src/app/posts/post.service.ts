// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Internal imports
import { Post } from './model/post.model';
import { RestGetPostsResponse, RestPostPostResponse, RestPutPostResponse, RestDeletePostResponse } from './model/rest-posts.model';


@Injectable({
    providedIn: 'root'
})
export class PostService {

  private POSTS_URL = 'http://localhost:3000/api/posts';

  // private Subject to prevent to next() from outside this class
  private postsChanged = new Subject<Post[]>();       // give all posts when changed
  private editedPostChanged = new Subject<Post>();    // give the post being edited (null if not edition mode)

  constructor(private http: HttpClient) {}


  // postsChanged is private, so we only expose an observable version of it (that cannot call next())
  getPostsObservable(): Observable<Post[]> {
    return this.postsChanged.asObservable();
  }


  // to edit a post, it needs to be selected from the list of posts
  // then it becomes editable from the post-create component
  startEditing(post: Post) {
    this.editedPostChanged.next(post);
  }

  
  // to stop the edition mode, we set the edited post to null
  stopEditing() {
    this.editedPostChanged.next(null);
  }

  
  // editedPostChanged is private, so we only expose an observable version of it (that cannot call next())
  getEditedPostObservable(): Observable<Post> {
    return this.editedPostChanged.asObservable();
  }


  // create a new post in the backend and refresh the posts list
  createPost(title: string, content: string): void {
    console.log('Creating post ' + title + ' / ' + content);
    this.http.post<RestPostPostResponse>(this.POSTS_URL, new Post(null, title, content))
        .subscribe((restResponse: RestPostPostResponse) => {
          console.log('Receiving from POST ' + this.POSTS_URL);
          console.log(restResponse);
          // force to refetch the posts so other parts of the code get the change
          this.fetchPosts();
        });
  }


   // edit an existing post in the backend and refresh the posts list
   editPost(postId: string, title: string, content: string): void {
    console.log('Editing post ' + postId + ' : ' + title + ' / '  + content);
    const url = this.POSTS_URL + '/' + postId;
    this.http.put<RestPutPostResponse>(url, new Post(postId, title, content))
        .subscribe((restResponse: RestPutPostResponse) => {
          console.log('Receiving from PUT ' + url);
          console.log(restResponse);
          // force to refetch the posts so other parts of the code get the change
          this.fetchPosts();
        });
  }


  // delete a post in the backend and refresh the posts list
  deletePost(postId: string): void {
    console.log('Deleting post ' + postId);
    const url = this.POSTS_URL + '/' + postId;
    this.http.delete<RestDeletePostResponse>(url)
        .subscribe( (restResponse: RestDeletePostResponse) => {
          console.log('Receiving from DELETE ' + url);
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
          this.stopEditing();
          this.postsChanged.next(posts);
        });
  }
}
