import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructoroverviewComponent } from './instructoroverview-component';

describe('InstructoroverviewComponent', () => {
  let component: InstructoroverviewComponent;
  let fixture: ComponentFixture<InstructoroverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructoroverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructoroverviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
