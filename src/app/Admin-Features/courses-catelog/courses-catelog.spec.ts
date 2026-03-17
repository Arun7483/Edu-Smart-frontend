import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesCatelog } from './courses-catelog';

describe('CoursesCatelog', () => {
  let component: CoursesCatelog;
  let fixture: ComponentFixture<CoursesCatelog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCatelog],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCatelog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
