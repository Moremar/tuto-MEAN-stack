// Angular imports
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Internal imports
import { PostService } from '../post.service';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    constructor(private postService: PostService) {}

    ngOnInit() {}

    onSavePost(postForm: NgForm): void {
      if (postForm.invalid) {
        alert('The post is invalid.');
      } else {
        this.postService.createPost(postForm.value.title, postForm.value.content);
        postForm.resetForm();
      }
    }
}
