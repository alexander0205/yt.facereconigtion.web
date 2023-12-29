import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriaHistoryComponent } from './auditoria-history/auditoria-history.component';
import { AuditoriaComponent } from './auditoria.component';
import { RequestHistoryComponent } from './request-history/request-history.component';
import { RequestViewComponent } from './request-view/request-view.component';
const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: `Auditorias` },
    component: AuditoriaComponent,
    children: [
      {
        path: '',
        redirectTo: '/Auditoria/historial',
        pathMatch: 'full'
      },
      {
        path: 'historial',
        component: AuditoriaHistoryComponent
      },
      {
        path: 'request',
        component: RequestHistoryComponent
      },
      { 
        path: 'request/:id', 
        component: RequestViewComponent
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriaRoutingModule { }
