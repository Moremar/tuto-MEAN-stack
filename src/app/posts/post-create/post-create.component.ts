// Angular imports
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Internal imports
import { Post } from '../model/post.model';
import { PostService } from '../post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { mimeType } from './mime-type.validator';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // if we are in editing mode, this is the post being edited, else it is a new post
  private editedPost: Post = new Post(null, null, null, null, null, null);
  editionMode = false;

  // a spinner is displayed if loading
  loading = false;

  // reactive form (required for file upload)
  postForm: FormGroup;

  // URL of the image of the post
  imagePreview: string = null;

  // set to true on validate to display error message for missing image
  // (not used for Material inputs since already handled)
  mustValidate = false;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private postService: PostService) {}


  ngOnInit() {
    // create the form
    this.postForm = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      // we validate the image selected, but no control in the HTML actually binds to it
      image: new FormControl(null, {validators: Validators.required, asyncValidators: mimeType})
    });

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
          // pre-poluate the form with the edited post
          this.postForm.setValue({
            title: this.editedPost.title,
            content: this.editedPost.content,
            image: this.editedPost.imagePath,
          });
          // display the preview in the HTML as well
          this.imagePreview = this.editedPost.imagePath;
        });
      }
    });
  }


  onImageSelected(event: Event): void {
    const selectedFile = (event.target as HTMLInputElement).files[0];
    // store the file itself in the form (not the path, the actual file)
    this.postForm.patchValue({image: selectedFile});
    this.postForm.controls.image.updateValueAndValidity();
    console.log('Selected file ' + selectedFile.name);

    const fileReader = new FileReader();
    // callback to apply once a file is read by the reader
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;  // readAsDataURL returns a string
    };
    fileReader.readAsDataURL(selectedFile);
  }


  // save the post (create new one or update the edited one if edition mode)
  onSavePost(): void {
    if (this.postForm.invalid) {
      // the validation in the HTML will show the error
      this.mustValidate = true;
      return;
    }

    // show the spinner, no need to set it back to false because we will navigate away from the page
    this.loading = true;

    // reflect the post modification in the form to the edited post
    this.editedPost.title = this.postForm.value.title;
    this.editedPost.content = this.postForm.value.content;

    if (this.editionMode) {
      this.postService.editPost(this.editedPost, this.postForm.value.image).subscribe(
        (_: Post) => {
          // no need to re-fetch, it will be done on navigate
          this.router.navigate(['list']);
        }
      );
    } else {
      this.postService.createPost(this.editedPost, this.postForm.value.image).subscribe(
        (_: Post) => {
          // no need to re-fetch, it will be done on navigate
          this.router.navigate(['list']);
        }
      );
    }
  }


  onCancel(): void {
    this.router.navigate(['list']);
  }
}
