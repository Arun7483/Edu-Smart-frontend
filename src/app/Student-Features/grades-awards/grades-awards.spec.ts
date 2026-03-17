import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesAwards } from './grades-awards';

describe('GradesAwards', () => {
  let component: GradesAwards;
  let fixture: ComponentFixture<GradesAwards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesAwards],
    }).compileComponents();

    fixture = TestBed.createComponent(GradesAwards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
