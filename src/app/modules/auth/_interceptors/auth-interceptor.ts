import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { AuthService } from "../_services/auth.service";


@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.auth.getToken();
        let newRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + token)
        });

        return next.handle(newRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status == 401) {
                    this.auth.logOut()
                }

                return throwError(error);
            })
        )
    }

}