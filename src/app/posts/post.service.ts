// Angular imports
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
// Internal imports
import { Post } from './model/post.model';


@Injectable({
    providedIn: 'root'
})
export class PostService {

    // should get the posts from backend, for now hardcoded here
    private posts: Post[] = [
    new Post('Post 1', 'My message 1'),
    new Post('Post 2', 'My message 2'),
  ];

  // private Subject to prevent to next() from outside this class
  private postsChanged = new Subject<Post[]>();

  constructor() {}

  getPostsObservable(): Observable<Post[]> {
    // postsChanged is private, so we only expose an observable version of it (that cannot call next())
    return this.postsChanged.asObservable();
  }

  createPost(title: string, message: string): void {
    this.posts.push(new Post(title, message));
    this.postsChanged.next([... this.posts]);   // copy of the posts
  }

  getPosts(): Post[] {
    return [... this.posts];  // copy of the posts
  }
}
