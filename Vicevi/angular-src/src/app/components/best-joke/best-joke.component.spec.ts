import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestJokeComponent } from './best-joke.component';

describe('BestJokeComponent', () => {
  let component: BestJokeComponent;
  let fixture: ComponentFixture<BestJokeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestJokeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestJokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
