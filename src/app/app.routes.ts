//Components
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent} from "./components/login/login.component";
import { UserComponent} from "./components/user/user.component";
import { HomeComponent } from "./components/home/home.component";
import { PriceComponent } from "./components/price/price.component";
import { CfComponent } from "./components/cf/cf.component";
import { OrderComponent } from "./components/order/order.component";
import { OldComponent } from "./components/order/old/old.component";
import { NewComponent } from "./components/order/new/new.component";
import { DesignComponent } from "./components/design/design.component";
import { PrintComponent } from "./components/print/print.component";
//Services
import { AuthGuardService } from "./services/auth-guard.service";
import { AuthViewService } from "./services/auth-view.service";


const APP_ROUTES: Routes = [
    {path: '', component: LoginComponent},
    {path: 'userAuthenticate/home', component: HomeComponent, canActivate: [AuthGuardService]},
    {path: 'userAuthenticate/users', component: UserComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: 'userAuthenticate/prices', component: PriceComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: 'userAuthenticate/CF', component: CfComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: 'userAuthenticate/order', component: OldComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: 'userAuthenticate/order/old', component: OldComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: 'userAuthenticate/order/new', component: NewComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: 'userAuthenticate/design', component: DesignComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: 'userAuthenticate/print', component: PrintComponent, canActivate: [AuthGuardService, AuthViewService]},
    {path: '**', pathMatch: 'full', redirectTo: ''}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);