import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class JokeService {

  options;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create a new joke post
  newJoke(joke) {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
    return this.http.post('jokes/newJoke', joke, this.options).pipe(map(res => res.json()));
  }
  getAllJokes() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
    return this.http.get('jokes/allJokes', this.options).pipe(map(res => res.json()));
  }
  getSingleJoke(id) {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
    return this.http.get('jokes/singleJoke/' + id, this.options).pipe(map(res => res.json()));
  }

  // Function to edit/update blog post
  editJoke(joke) {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
    return this.http.put('jokes/updateJoke/', joke, this.options).pipe(map(res => res.json()));
  }
  deleteJoke(id) {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
    return this.http.delete('jokes/deleteJoke/' + id, this.options).pipe(map(res => res.json()));
  }
  likeJoke(id) {
    return this.http.put('jokes/likeJoke/', { id: id }, this.options).pipe(map(res => res.json()));
  }

  // Function to dislike a joke post
  dislikeJoke(id) {
    return this.http.put('jokes/dislikeJoke/', { id: id }, this.options).pipe(map(res => res.json()));
  }

  postComment(id, comment) {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
    const jokeData = {
      id: id,
      comment: comment
    }
    return this.http.post('jokes/comment', jokeData, this.options).pipe(map(res => res.json()));

  }
}