import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './modules/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from './modules/auth/_services/auth-guard.service';


const appRoutes: Routes = [

   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent },
   { path: '', component: HomeComponent,
      canActivate: [AuthGuardService],
      children:
      [            
         {
            path: 'Dashboard',
            loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
         },
         {
            path: 'Casos',
            loadChildren: () => import('./modules/service/service.module').then(m => m.ServiceModule)
         },
         {
            path: 'Reportes',
            loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
         },
         {
            path: 'Admin',
            loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
         },
         {
            path: 'Expedientes',
            loadChildren: () => import('./modules/basic-records/basic-records.module').then(m => m.BasicRecordsModule)
         },
         {
            path: 'Auditoria',
            loadChildren: () => import('./modules/auditoria/auditoria.module').then(m => m.AuditoriaModule)
         }
      ]
   },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes, {});