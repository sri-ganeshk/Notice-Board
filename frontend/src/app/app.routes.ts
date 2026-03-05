import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { NoticePage } from './pages/noticePage/notice';
import { EventPage } from './pages/eventPage/event';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { Notices } from './components/notices/notices';
import { Events } from './components/events/events';
import { AddContentComponent } from './pages/admin/addContent/addContent.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', canActivate : [AuthGuard], component : DashboardComponent, 
    children :[
      { path: '', redirectTo: 'notices', pathMatch: 'full' },
      { path: 'notices', component: Notices, canActivate: [AuthGuard] },
      { path: 'events', component: Events, canActivate: [AuthGuard] },
    ]
   },
  
  { path: 'admin', canActivate: [AdminGuard], component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'add-content', pathMatch: 'full' },
      { path: 'add-content', component: AddContentComponent, canActivate: [AdminGuard] },
    ]
  },
  
  { path: 'notice/:id', component: NoticePage, canActivate: [AuthGuard] },
  { path: 'event/:id', component: EventPage, canActivate: [AuthGuard] },
  { path: '**', component : NotFoundComponent }

];
