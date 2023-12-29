import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";

const routes: Route[] = [
    {
        path: '',
        component: AdminComponent,
        data: { breadcrumb: `Usuarios` }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }