import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth/_services/auth-guard.service';
import { FormsCreationComponent } from './service/forms-creation/forms-creation.component';
import { RecordHistoryComponent } from './service/record-history/record-history.component';
import { ServiceComponent } from './service/service.component';


const routes: Routes = [

  {

    path: '',
    component: ServiceComponent,
    data: { breadcrumb: `Registros de Servicios` },
    canActivate: [AuthGuardService],
    children: [

      {

        path: '',
        redirectTo: '/Casos/historial',
        pathMatch: 'full'
      },
      {
        path: 'creacionRecord/:idAsistenciaDiaria',
        component: FormsCreationComponent
      },
      {
        path: 'creacionRecord',
        component: FormsCreationComponent,
        // data: { breadcrumb: 'Crear' },
      },
    
      {
        path: 'historial',
        component: RecordHistoryComponent
      },

    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class serviceRoutingModule { }
