// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
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
  private totalSub: Subscription;

  // a spinner is displayed if loading
  loading = false;

  // paginator fields
  numberOfPosts = 0;
  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions = [2, 5, 10];

  constructor(private router: Router,
              private postService: PostService) {
  }


  ngOnInit() {
    this.loading = true;
    // fetch the posts from the backend
    this.postService.fetchPosts(this.pageIndex, this.pageSize);
    // listen to any change on the posts
    this.postsSub = this.postService.getPostsObservable().subscribe(
      (posts: Post[]) => {
        this.loading = false;
        this.posts = posts;
      }
    );
    this.totalSub = this.postService.getTotalPostsObservable().subscribe(
      (total: number) => {
        this.numberOfPosts = total;
      }
    );
  }


  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
    if (this.totalSub) {
      this.totalSub.unsubscribe();
    }
  }


  onEdit(post: Post) {
    this.router.navigate(['edit', post.id]);
  }


  onDelete(postId: string) {
    this.loading = true;
    this.postService.deletePost(postId).subscribe(
      (_: string) => {
        // when we delete the last post of a page, must move back to the previous page
        if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.numberOfPosts - 1) {
          this.pageIndex -= 1;
        }
        // refetch the posts now that one got deleted
        this.postService.fetchPosts(this.pageIndex, this.pageSize);
      }
    );
  }


  onPageChanged(pageInfo: PageEvent) {
    console.log(pageInfo);
    this.loading = true;
    this.pageIndex = pageInfo.pageIndex;
    this.pageSize = pageInfo.pageSize;
    this.postService.fetchPosts(this.pageIndex, this.pageSize);
  }
}
