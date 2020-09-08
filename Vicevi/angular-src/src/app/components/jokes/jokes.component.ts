import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { JokeService } from '../../services/joke.service';


@Component({
  selector: 'app-jokes',
  templateUrl: './jokes.component.html',
  styleUrls: ['./jokes.component.css']
})
export class JokesComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingJokes = false;
  form;
  commentForm;
  processing = false;
  username;
  jokePosts;
  newComment = [];
  enabledComments = [];


  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private jokeService: JokeService)
    { 
      this.createNewJokeForm();
      this.createCommentForm();
    }

    createNewJokeForm() {
      this.form = this.formBuilder.group({
        title: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          this.alphaNumericValidation
        ])],
        body: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(5)
        ])]
      })
    }
    
    createCommentForm() {
      this.commentForm = this.formBuilder.group({
        comment: ['', Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200)
        ])]
      })
    }

    enableCommentForm() {
      this.commentForm.get('comment').enable(); // Enable comment field
    }

    disableCommentForm() {
      this.commentForm.get('comment').disable(); // Disable comment field
    }

    enableFormNewJokeForm() {
      this.form.get('title').enable(); // Enable title field
      this.form.get('body').enable(); // Enable body field
    }

    disableFormNewJokeForm() {
      this.form.get('title').disable(); // Disable title field
      this.form.get('body').disable(); // Disable body field
    }
    
    alphaNumericValidation(controls) {
      const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
      // Check if test returns false or true
      if (regExp.test(controls.value)) {
        return null; // Return valid
      } else {
        return { 'alphaNumericValidation': true } // Return error in validation
      }
    }
  newJokeForm(){
    this.newPost=true;

  }
  draftComment(id) {
    this.commentForm.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id); // Add the post that is being commented on to the array
  }
  cancelComment(id) {
    const index = this.newComment.indexOf(id); // Check the index of the blog post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }
  reloadJokes() {
    this.loadingJokes = true; // Used to lock button
    this.getAllJokes(); // Add any new blogs to the page
    setTimeout(() => {
      this.loadingJokes = false; // Release button lock after four seconds
    }, 4000);
  }

  onJokeSubmit() {
    this.processing = true; // Disable submit button
    this.disableFormNewJokeForm(); // Lock form
    // Create blog object from form fields
    const joke = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      createdBy: this.username // CreatedBy field
    }

    // Function to save blog into database
    this.jokeService.newJoke(joke).subscribe(data => {
      // Check if blog was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewJokeForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getAllJokes();

        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewJokeForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  goBack() {
    window.location.reload(); // Clear all variable states
  }
  getAllJokes() {
    // Function to GET all joke from database
    this.jokeService.getAllJokes().subscribe(data => {
      this.jokePosts = data.jokes; // Assign array to use in HTML
    });
  }
  likeJoke(id) {
    // Service to like a joke post
    this.jokeService.likeJoke(id).subscribe(data => {
      this.getAllJokes(); // Refresh joke after like
    });
  }

// Function to disliked a joke post
  dislikeJoke(id) {
    // Service to dislike a joke post
    this.jokeService.dislikeJoke(id).subscribe(data => {
      this.getAllJokes(); // Refresh joke after dislike
    });
  }


  postComment(id) {
    this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.jokeService.postComment(id, comment).subscribe(data => {
      this.getAllJokes(); // Refresh all joke to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the joke id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  // Expand the list of comments
  expand(id) {
    this.enabledComments.push(id); // Add the current joke post id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
  }
  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new joke posts and comments
    });
    this.getAllJokes();
  }

}
