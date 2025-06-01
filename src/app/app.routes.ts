import {Routes} from '@angular/router';
import {LoginCallbackComponent} from "@common/components/auth/LoginCallbackComponent";
import {HomeComponent} from "./features/home/home.component";
import {UsersComponent} from "./features/home/users/pages/users.component";
import {RoleGuardService} from "@common/components/auth/role-guard.service";
import {Role} from "@common/components/auth/models/role.model";
import {CustomerComponent} from "./features/customer/pages/customer.component";
import {AccessLinkComponent} from "./features/home/access-links/pages/access-link.component";
import {TareasLegalesComponent} from "./features/home/tareas-legales/pages/tareas-legales.component";
import {
    ProcedimientosLegalesComponent
} from "./features/home/procedimientos-legales/pages/procedimientos-legales.component";
import {TareaLegalService} from "./features/home/tareas-legales/tarea-legal.service";
import {ProcedimientoLegalService} from "./features/home/procedimientos-legales/procedimiento-legal.service";
import {AccessLinkService} from "./features/home/access-links/access-link.service";
import {UserService} from "./features/home/users/user.service";

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'callback', component: LoginCallbackComponent},
    {
        path: 'home', component: HomeComponent,
        children: [
            {
                path: 'users', component: UsersComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [UserService]
            },
            {
                path: 'access-links', component: AccessLinkComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [AccessLinkService]
            },
            {
                path: 'tareas-legales', component: TareasLegalesComponent, canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [TareaLegalService]
            },
            {
                path: 'procedimientos-legales',
                component: ProcedimientosLegalesComponent,
                canActivate: [RoleGuardService],
                data: {roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR]},
                providers: [ProcedimientoLegalService]
            },
        ]
    },
    {path: 'customer/edit-profile/:mobile/:token', component: CustomerComponent}
];
