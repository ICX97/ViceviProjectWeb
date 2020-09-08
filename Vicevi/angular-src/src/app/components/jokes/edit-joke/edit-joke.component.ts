import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JokeService } from '../../../services/joke.service';

@Component({
  selector: 'app-edit-joke',
  templateUrl: './edit-joke.component.html',
  styleUrls: ['./edit-joke.component.css']
})
export class EditJokeComponent implements OnInit {
  
  message;
  messageClass;
  joke;
  processing = false;
  currentUrl;
  loading = true;
  
  constructor(private location: Location,
    private activatedRoute: ActivatedRoute,
    private jokeService: JokeService,
    private router: Router) { }

    updateJokeSubmit() {
      this.processing = true; // Lock form fields
      // Function to send joke object to backend
      this.jokeService.editJoke(this.joke).subscribe(data => {
        // Check if PUT request was a success or not
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Set error bootstrap class
          this.message = data.message; // Set error message
          this.processing = false; // Unlock form fields
        } else {
          this.messageClass = 'alert alert-success'; // Set success bootstrap class
          this.message = data.message; // Set success message
          // After two seconds, navigate back to joke page
          setTimeout(() => {
            this.router.navigate(['/jokes']); // Navigate back to route page
          }, 2000);
        }
      });
    }
  
    // Function to go back to previous page
    goBack() {
      this.location.back();
    }
  
    ngOnInit() {
      this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
      // Function to GET current joke with id in params
      this.jokeService.getSingleJoke(this.currentUrl.id).subscribe(data => {
        // Check if GET request was success or not
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Set bootstrap error class
          this.message = 'Joke not found.'; // Set error message
        } else {
          this.joke = data.joke; // Save joke object for use in HTML
          this.loading = false; // Allow loading of joke form
        }
      });
  
    }

}
