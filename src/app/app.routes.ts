import { Routes } from '@angular/router';
import { LandingPageComponent } from './Landing-page/landing-component/landing-component';
import { SignupComponent } from './Login/signup/signup';

// Import your standalone components


// Import the LoginComponent once you generate it
// import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  // Default route loading the Landing Page
  { path: '', component: LandingPageComponent }, 
  
  // Authentication Routes
  { path: 'signup', component: SignupComponent },
  
  // Uncomment this once you have created the login component
  // { path: 'login', component: LoginComponent },
  
  // Catch-all wildcard route to redirect invalid URLs back to the home page
  { path: '**', redirectTo: '' } 
];