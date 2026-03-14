import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogin } from './login-login';

describe('LoginLogin', () => {
  let component: LoginLogin;
  let fixture: ComponentFixture<LoginLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
