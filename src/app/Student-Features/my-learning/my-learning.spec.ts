import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLearningHtml } from './my-learning';

describe('MyLearningHtml', () => {
  let component: MyLearningHtml;
  let fixture: ComponentFixture<MyLearningHtml>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLearningHtml],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLearningHtml);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
