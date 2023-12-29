import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportLayoutComponent } from "./layout/report-layout/report-layout.component";
import { ByDateRangeReportComponent } from "./reportForms/by-date-range-report/by-date-range-report.component";



const routes: Routes = [
    {
        path: '',
        component: ReportLayoutComponent,
        data: { breadcrumb: `Reportes` }
        , children: [
            {
                path: 'ReportPorAbogado',
                component: ByDateRangeReportComponent
            },
            {
                path: 'ReportPorFaseProceso',
                component: ByDateRangeReportComponent
            },
            {
                path: 'ReportPorInstanciaJudicial',
                component: ByDateRangeReportComponent
            },
            {
                path: 'ReportPorMotivoVisita',
                component: ByDateRangeReportComponent
            },
            {
                path: 'ReportPorNacionalidad',
                component: ByDateRangeReportComponent
            },
            {
                path: 'ReportPorRLT',
                component: ByDateRangeReportComponent            
            },
            {
                path: 'ReportPorSectorEconomico',
                component: ByDateRangeReportComponent
            }
        ]
    }]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportsRouterModule { }