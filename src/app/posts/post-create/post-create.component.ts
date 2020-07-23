// Angular imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
// Internal imports
import { Post } from '../model/post.model';
import { PostService } from '../post.service';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // if we are in editing mode, this is the post being edited, else null
  private editedPost: Post = null;

  // handler on the JS form representation provided by Angular
  @ViewChild('postForm', {static: false}) postForm: NgForm;


  constructor(private postService: PostService) {}

  
  ngOnInit() {
    // track when a post gets edited or edition mode stops to update the GUI
    this.postService.getEditedPostObservable().subscribe(
      (post: Post) => {
        this.editedPost = post;
        if (this.editedPost == null) {
          // switch to creation mode (reset the title / content inputs)
          this.postForm.resetForm();
        } else {
          // switch to edition mode (load the title / content of the edited post)
          this.postForm.setValue({
            title: this.editedPost.title,
            content: this.editedPost.content
          });
        }
      })
  }


  // save the post (create new one or update the edited one if edition mode)
  onSavePost(): void {
    if (this.postForm.invalid) {
      // the validation in the HTML will show the error
      return;
    }
    if (this.editedPost == null) {
      // creation mode
      this.postService.createPost(this.postForm.value.title, this.postForm.value.content);
    } else {
      // edition mode
      this.postService.editPost(this.editedPost.id, this.postForm.value.title, this.postForm.value.content);
      this.postService.stopEditing();
    }
    this.postForm.resetForm();
  }


  // stop the edition mode
  onCancel(): void {
    this.postService.stopEditing();
  }
}
