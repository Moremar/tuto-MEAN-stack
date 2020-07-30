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

  // private Subjects to prevent to next() from outside this class
  private postsChanged = new Subject<Post[]>();    // give all posts to display when changed
  private totalPostsObs = new Subject<number>();    // give the total number of posts

  constructor(private http: HttpClient,
              private router: Router) {}


  // postsChanged is private, so we only expose an observable version of it (that cannot call next())
  getPostsObservable(): Observable<Post[]> {
    return this.postsChanged.asObservable();
  }

  getTotalPostsObservable(): Observable<number> {
    return this.totalPostsObs.asObservable();
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
  createPost(newPost: Post, image: File): Observable<Post> {
    console.log('Creating post ' + newPost.title + ' / ' + newPost.content);

    // Use a FormData instead of JSON since we need both k/v and a file
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', image, newPost.title);

    return this.http.post<RestPostPostResponse>(this.POSTS_URL, postData)
        .pipe(map(
          (restResponse: RestPostPostResponse) => {
            console.log('Receiving from POST ' + this.POSTS_URL);
            console.log(restResponse);
            // add the new post in the allPost array
            newPost.id = restResponse.post._id;
            newPost.imagePath = restResponse.post.imagePath;
            return newPost;
          }
        ));
  }


   // edit an existing post in the backend and refresh the posts list
   editPost(editedPost: Post, image: File | string): Observable<Post> {
    console.log('Editing post ' + editedPost.id + ' : ' + editedPost.title + ' / '  + editedPost.content);

    // the image can be either a file (if uploading a new file)
    // or an image URL (if keeping the previous one)
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
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
    return this.http.put<RestPutPostResponse>(url, postData)
        .pipe(map(
          (restResponse: RestPutPostResponse) => {
            console.log('Receiving from PUT ' + url);
            console.log(restResponse);
            return new Post(restResponse.post._id,
                            restResponse.post.title,
                            restResponse.post.content,
                            restResponse.post.imagePath);
          }
      ));
  }


  // delete a post in the backend and refresh the posts list
  deletePost(postId: string): Observable<string> {
    console.log('Deleting post ' + postId);
    const url = this.POSTS_URL + '/' + postId;
    return this.http.delete<RestDeletePostResponse>(url)
      .pipe(map(
        (restResponse: RestDeletePostResponse) => {
          console.log('Receiving from DELETE ' + url);
          console.log(restResponse);
          return restResponse.id;
        }
      ));
  }


  // refresh the posts list from the backend
  fetchPosts(pageIndex: number, pageSize: number): void {
    console.log('FETCHING ' + pageIndex + '/' + pageSize);
    const url = this.POSTS_URL + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize;
    this.http.get<RestGetPostsResponse>(url)
        .pipe(
          // reshape the data from the backend to turn it into a list of Post elements
          // following the model of the front end (rename _id to id)
          map( (mongoPosts: RestGetPostsResponse) => {
            console.log('Receiving from GET ' + url);
            console.log(mongoPosts);
            this.totalPostsObs.next(mongoPosts.total);
            return mongoPosts.posts.map( post => {
              return new Post(post._id, post.title, post.content, post.imagePath);
            });
          }
        ))
        // subcribe to the new Post array to update the GUI with it
        .subscribe((posts: Post[]) => {
          this.postsChanged.next(posts);
        });
  }
}
