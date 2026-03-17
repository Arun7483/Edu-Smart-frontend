import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzesExams } from './quizzes-exams';

describe('QuizzesExams', () => {
  let component: QuizzesExams;
  let fixture: ComponentFixture<QuizzesExams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizzesExams],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizzesExams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
