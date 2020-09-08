import { Component, OnInit } from '@angular/core';
import { JokeService } from '../../services/joke.service';
@Component({
  selector: 'app-best-joke',
  templateUrl: './best-joke.component.html',
  styleUrls: ['./best-joke.component.css']
})
export class BestJokeComponent implements OnInit {
  vicevi=[];
  constructor(private jokeService:JokeService) { }

  ngOnInit() {
    this.jokeService.getAllJokes().subscribe(data => {
      this.vicevi = data.jokes;
      this.vicevi=this.vicevi.sort((obj1, obj2) => {
        if (obj1.likes > obj2.likes)return -1;
        if (obj1.likes < obj2.likes)return 1;
      return 0;
      });
    });
  
  }
}
