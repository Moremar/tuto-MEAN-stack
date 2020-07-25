// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
// Internal imports
import { Post } from './model/post.model';
import { RestGetPostsResponse, RestPostPostResponse,
         RestPutPostResponse, RestDeletePostResponse,
         RestGetPostResponse } from './model/rest-posts.model';


@Injectable({
    providedIn: 'root'
})
export class PostService {

  private POSTS_URL = 'http://localhost:3000/api/posts';

  // keep all posts in memory so we do not need to re-fetch all posts at every change
  private allPosts: Post[] = [];

  // private Subject to prevent to next() from outside this class
  private postsChanged = new Subject<Post[]>();    // give all posts when changed

  constructor(private http: HttpClient,
              private router: Router) {}


  // postsChanged is private, so we only expose an observable version of it (that cannot call next())
  getPostsObservable(): Observable<Post[]> {
    return this.postsChanged.asObservable();
  }


  // get an observable on a specific post in the backend
  getPostObservable(postId: string): Observable<Post> {
    return this.http.get<RestGetPostResponse>(this.POSTS_URL + '/' + postId)
        .pipe(
          map((restResponse: RestGetPostResponse) => {
            // convert to Frontend post format
            return new Post(restResponse.post._id, 
                            restResponse.post.title,
                            restResponse.post.content,
                            restResponse.post.imagePath);
          })
        );
  }


  // create a new post in the backend and refresh the posts list
  createPost(newPost: Post, image: File): void {
    console.log('Creating post ' + newPost.title + ' / ' + newPost.content);

    // Use a FormData instead of JSON since we need both k/v and a file
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', image, newPost.title);

    this.http.post<RestPostPostResponse>(this.POSTS_URL, postData)
        .subscribe((restResponse: RestPostPostResponse) => {
          console.log('Receiving from POST ' + this.POSTS_URL);
          console.log(restResponse);
          // add the new post in the allPost array
          newPost.id = restResponse.post._id;
          newPost.imagePath = restResponse.post.imagePath;
          this.allPosts.push(newPost);
          this.refreshPosts();
          this.router.navigate(['list']);
        });
  }


   // edit an existing post in the backend and refresh the posts list
   editPost(editedPost: Post, image: File | string): void {
    console.log('Editing post ' + editedPost.id + ' : ' + editedPost.title + ' / '  + editedPost.content);

    // the image can be either a file (if uploading a new file)
    // or an image URL (if keeping the previous one)
    let postData: Post | FormData;
    if (typeof(image) == 'object') {
      // the file must be uploaded, we need to use a Form data for the body of the POST REST call
      postData = new FormData();
      postData.append('id', editedPost.id);
      postData.append('title', editedPost.title);
      postData.append('content', editedPost.content);
      postData.append('image', image, editedPost.title);
    } else {
      // no new file to upload, we can send a JSON object for the PUT body
      postData = new Post(editedPost.id, editedPost.title, editedPost.content, image);
    }

    const url = this.POSTS_URL + '/' + editedPost.id;
    this.http.put<RestPutPostResponse>(url, postData)
        .subscribe((restResponse: RestPutPostResponse) => {
          console.log('Receiving from PUT ' + url);
          console.log(restResponse);
          // update the edited post in the allPost array
          this.allPosts = this.allPosts.map((post: Post) => {
            if (post.id == post.id) {
              return new Post(editedPost.id, editedPost.title, editedPost.content, restResponse.post.imagePath);
            } else {
              return post;
            }
          });
          this.refreshPosts();
          this.router.navigate(['list']);
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
          this.allPosts = this.allPosts.filter( (post: Post) => { return post.id != postId; });
          this.refreshPosts();
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
              return new Post(post._id, post.title, post.content, post.imagePath);
            })
          }
        ))
        // subcribe to the new Post array to update the GUI with it
        .subscribe((posts: Post[]) => {
          this.allPosts = posts;
          this.refreshPosts();
        });
  }


  // let the other parts of the app know about the current posts
  refreshPosts(): void {
    // send a copy of the allPosts array
    this.postsChanged.next(this.allPosts.slice());
  }
}
