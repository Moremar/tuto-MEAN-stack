// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// Internal imports
import { Post } from '../model/post.model';
import { PostService } from '../post.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(private router: Router,
              private postService: PostService) {
  }


  ngOnInit() {
    // fetch the posts from the backend
    this.postService.fetchPosts();
    // listen to any change on the posts
    this.postsSub = this.postService.getPostsObservable().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );
  }


  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
  }


  onEdit(post: Post) {
    this.router.navigate(['edit', post.id]);
  }


  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
