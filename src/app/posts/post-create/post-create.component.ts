// Angular imports
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Internal imports
import { Post } from '../model/post.model';
import { PostService } from '../post.service';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // if we are in editing mode, this is the post being edited, else it is a new post
  private editedPost: Post = new Post(null, '', '');
  private editionMode = false;

  // a spinner is displayed if loading
  loading = false;

  constructor(private router: Router, 
              private activeRoute: ActivatedRoute,
              private postService: PostService) {}

  
  ngOnInit() {
    // if this component is loaded from the /edit/:id route, it has the ID of the post to edit
    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.editionMode = paramMap.has('id');
      if (this.editionMode) {
        // load the post to edit
        this.loading = true;
        this.postService.getPostObservable(paramMap.get('id')).subscribe((post: Post) => {
          // that will update the title and content in the form
          this.editedPost = post;
          this.loading = false;
        });
      }
    });
  }


  // save the post (create new one or update the edited one if edition mode)
  onSavePost(postForm: NgForm): void {
    if (postForm.invalid) {
      // the validation in the HTML will show the error
      return;
    }

    // show the spinner, no need to set it back to false because we will navigate away from the page
    this.loading = true;

    if (this.editionMode) {
      this.postService.editPost(this.editedPost);
    } else {
      this.postService.createPost(this.editedPost);
    }
    // the post service will automatically redirect to /list once the save is done in DB
  }


  onCancel(): void {
    this.router.navigate(['list']);
  }
}
