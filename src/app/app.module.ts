import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartModule } from "primeng/chart";
import { TableModule } from "primeng/table";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { CookieService } from "ngx-cookie-service";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ButtonModule } from "primeng/button";

/* SERVICES */
import { RoutingGuard } from "./routing.guard";

/* COMPONENTS */
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HeaderBeforeLoginComponent } from "./header-before-login/header-before-login.component";
import { HeaderAfterLoginComponent } from "./header-after-login/header-after-login.component";
import { SideBarComponent } from "./side-bar/side-bar.component";
import { FooterBeforeLoginComponent } from "./footer-before-login/footer-before-login.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { GroupListComponent } from "./group-list/group-list.component";
import { GroupLeadsComponent } from "./group-leads/group-leads.component";
import { FilterDropdownComponent } from "./filter-dropdown/filter-dropdown.component";
import { BillingComponent } from "./billing/billing.component";
import { CounterdisplayformatPipe } from "./pipes/counterdisplayformat.pipe";
import { AdminBioComponent } from "./admin-bio/admin-bio.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetPasswordComponent,
    DashboardComponent,
    HeaderBeforeLoginComponent,
    HeaderAfterLoginComponent,
    SideBarComponent,
    FooterBeforeLoginComponent,
    ResetPasswordComponent,
    GroupListComponent,
    GroupLeadsComponent,
    FilterDropdownComponent,
    BillingComponent,
    CounterdisplayformatPipe,
    AdminBioComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    TableModule,
    VirtualScrollerModule,
    Ng2SearchPipeModule,
    AppRoutingModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    ProgressSpinnerModule,
    ButtonModule,
  ],
  providers: [
    RoutingGuard,
    CookieService,
    GroupListComponent,
    GroupLeadsComponent,
    FilterDropdownComponent,
    HeaderAfterLoginComponent,
    DashboardComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
