import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalReports } from './global-reports';

describe('GlobalReports', () => {
  let component: GlobalReports;
  let fixture: ComponentFixture<GlobalReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalReports],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
