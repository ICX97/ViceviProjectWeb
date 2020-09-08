import { Component, OnInit } from '@angular/core';
import { JokeService } from '../../../services/joke.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-joke',
  templateUrl: './delete-joke.component.html',
  styleUrls: ['./delete-joke.component.css']
})
export class DeleteJokeComponent implements OnInit {
  message;
  messageClass;
  foundJoke = false;
  processing = false;
  joke;
  currentUrl;
  constructor(private jokeService: JokeService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

    deleteJoke() {
      this.processing = true; // Disable buttons
      // Function for DELETE request
      this.jokeService.deleteJoke(this.currentUrl.id).subscribe(data => {
        // Check if delete request worked
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return error bootstrap class
          this.message = data.message; // Return error message
        } else {
          this.messageClass = 'alert alert-success'; // Return bootstrap success class
          this.message = data.message; // Return success message
          // After two second timeout, route to joke page
          setTimeout(() => {
            this.router.navigate(['/jokes']); // Route users to joke page
          }, 2000);
        }
      });
    }
  
    ngOnInit() {
      this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
      // Function for GET request to retrieve joke
      this.jokeService.getSingleJoke(this.currentUrl.id).subscribe(data => {
        // Check if request was successfull
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return bootstrap error class
          this.message = data.message; // Return error message
        } else {
          // Create the joke object to use in HTML
          this.joke = {
            title: data.joke.title, // Set title
            body: data.joke.body, // Set body
            createdBy: data.joke.createdBy, // Set created_by field
            createdAt: data.joke.createdAt // Set created_at field
          }
          this.foundJoke = true; // Displaly joke window
        }
      });
    }

}
