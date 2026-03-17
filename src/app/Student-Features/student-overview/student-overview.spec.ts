import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOverview } from './student-overview';

describe('StudentOverview', () => {
  let component: StudentOverview;
  let fixture: ComponentFixture<StudentOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
