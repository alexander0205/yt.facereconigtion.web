import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule, } from '@angular/forms';    //Added by me for using Data-binding
import { CommonModule } from '@angular/common'; //Added by me for use ngIf
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';

/*Charts Reporting*/

/*Routes*/
import { routing, appRoutingProviders } from './app.routing';

//Components
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BreadcrumService } from './_services/breadcrum.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceModule } from './modules/service/service.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ToastrModule } from 'ngx-toastr/toastr/toastr.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core/lib/translate.loader';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';
import { AuthModule } from './modules/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './modules/auth/_interceptors/auth-interceptor';
import { AuthGuardService } from './modules/auth/_services/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SesionServiceService } from './_services/sesion-service.service';
import { IdleExpiry, LocalStorageExpiry } from '@ng-idle/core';
import { ButtonModule } from 'primeng/button';
import { ConnectionServiceModule } from 'ngx-connection-service/lib/connection-service.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AvatarModule } from 'primeng/avatar';
import { ReportsModule } from './modules/reports/reports.module';
import { AdminModule } from './modules/admin/admin.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BasicRecordsModule } from './modules/basic-records/basic-records.module';
import { AvanceSearchComponent } from './modules/avance-search/avance-search.component';
import { NotesComponent } from './modules/notes/notes.component';
import { AllowHyphensDirective } from './allow-hyphens.directive';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { LoggingInterceptor } from './modules/shared/_services/http-client/http-interceptor';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';



export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    AvanceSearchComponent,
    NotesComponent,
    AllowHyphensDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AvatarModule,
    ServiceModule,
    // AsistenciaModule,
    BasicRecordsModule,
    AuditoriaModule,
    AuthModule,
    ReportsModule,
    DashboardModule,
    ReactiveFormsModule,
    ButtonModule,
    LoadingBarRouterModule,
    routing,
    NgbModule,
    LoadingBarModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),

    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    JwtModule.forRoot({
      config: {
        // ...
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
      },
    }),
    NgIdleKeepaliveModule.forRoot(),
    LeafletModule
    ,
    CurrencyMaskModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ConnectionServiceModule,
    AdminModule,
    DragDropModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule
  ],
  providers: [appRoutingProviders, BreadcrumService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    , AuthGuardService
    , SesionServiceService
    , {
        provide: IdleExpiry,
        useClass: LocalStorageExpiry,
      }   
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }

