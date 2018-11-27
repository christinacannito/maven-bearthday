import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedComponent } from './saved.component';

describe('SavedComponent', () => {
  let component: SavedComponent;
  let fixture: ComponentFixture<SavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    component = new SavedComponent()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
