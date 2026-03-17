import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Assesment } from './assesment';

describe('Assesment', () => {
  let component: Assesment;
  let fixture: ComponentFixture<Assesment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Assesment],
    }).compileComponents();

    fixture = TestBed.createComponent(Assesment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
