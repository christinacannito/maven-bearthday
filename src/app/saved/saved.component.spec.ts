import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedComponent } from './saved.component';

describe('SavedComponent', () => {
  let component: SavedComponent;
  let fixture: ComponentFixture<SavedComponent>;
  let mockStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(SavedComponent);
    mockStorageService = jasmine.createSpyObj(['get', 'set'])
    component = new SavedComponent(mockStorageService)
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
