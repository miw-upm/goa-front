import {Routes} from '@angular/router';
import {LoginCallbackComponent} from "@common/components/LoginCallbackComponent";
import {HomeComponent} from "./features/home/home.component";
import {UsersComponent} from "./features/home/users/users.component";
import {RoleGuardService} from "@core/services/role-guard.service";
import {Role} from "@core/models/role.model";
import {CustomerComponent} from "./features/customer/customer.component";
import {AccessLinkComponent} from "./features/home/access-links/access-link.component";

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'callback', component: LoginCallbackComponent},
    {
        path: 'home', component: HomeComponent,
        children: [
            {
                path: 'users', component: UsersComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]}
            },
            {
                path: 'access-links', component: AccessLinkComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]}
            }
        ]
    },
    {path: 'customer/edit-profile/:mobile/:token', component: CustomerComponent}
];
