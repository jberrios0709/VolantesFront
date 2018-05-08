import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//Routes
import {APP_ROUTING} from './app.routes';
//Services
import { HttpService } from './services/http.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { InfoSharedService } from './services/info-shared.service';
import { AuthViewService } from './services/auth-view.service';
//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PriceComponent } from './components/price/price.component';
import { CfComponent } from './components/cf/cf.component';
import { OrderComponent } from './components/order/order.component';
import { NewComponent } from './components/order/new/new.component';
import { OldComponent } from './components/order/old/old.component';
import { DesignComponent } from './components/design/design.component';
import { PrintComponent } from './components/print/print.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { InComponent } from './components/in/in.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    UserComponent,
    FooterComponent,
    HomeComponent,
    PriceComponent,
    CfComponent,
    OrderComponent,
    NewComponent,
    OldComponent,
    DesignComponent,
    PrintComponent,
    DeliveryComponent,
    InComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    APP_ROUTING,
    ReactiveFormsModule
  ],
  providers: [
    HttpService,
    AuthGuardService,
    AuthService,
    AuthViewService,
    InfoSharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
