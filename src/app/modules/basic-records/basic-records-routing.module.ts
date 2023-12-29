import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicRecordListComponent } from './basic-record-list/basic-record-list.component';
import { BasicRecordComponent } from './basic-record/basic-record.component';
import { BasicRecordHistoryComponent } from './basic-record-history/basic-record-history.component';
import { BasicRecordNewComponent } from './basic-record-new/basic-record-new.component';
const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: `Expedientes` },
    component: BasicRecordComponent,
    children: [
      { path: '', redirectTo: '/Expedientes/asistenciaJudicial', pathMatch: 'full' },
      { path: 'asistenciaJudicial', component: BasicRecordListComponent },
      {
        path: 'historial',
        component: BasicRecordHistoryComponent,

      },
      { path: 'crearExpediente/:id', component: BasicRecordNewComponent },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicRecordsRoutingModule { }
