import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutingGuard } from './routing.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GroupListComponent } from './group-list/group-list.component';
import { AdminBioComponent } from './admin-bio/admin-bio.component';
import { GroupLeadsComponent } from './group-leads/group-leads.component';
import { BillingComponent } from './billing/billing.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'login', redirectTo: '', pathMatch: 'full' },
	{ path: 'forgetPassword', component: ForgetPasswordComponent },
	{ path: 'resetPassword/:key', component: ResetPasswordComponent },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [RoutingGuard] },
	{ path: 'groupList', component: GroupListComponent, canActivate: [RoutingGuard] },
	{ path: 'profile', component: AdminBioComponent, canActivate: [RoutingGuard] },
	{ path: 'groupLeads', component: GroupLeadsComponent, canActivate: [RoutingGuard] },
	{ path: 'billing', component: BillingComponent, canActivate: [RoutingGuard] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
