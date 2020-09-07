import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private toastr: ToastrService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((errorRes: HttpErrorResponse) => {
                if (errorRes) {
                    if (errorRes.status === 400) {
                        if (errorRes.error.errors) {
                            throw errorRes.error;
                        } else {
                            this.toastr.error(errorRes.error.message, errorRes.error.statusCode);
                        }
                    }
                    if (errorRes.status === 401) {
                        this.toastr.error(errorRes.error.message, errorRes.error.statusCode);
                    }
                    if (errorRes.status === 404) {
                        this.router.navigateByUrl('/not-found');
                    }
                    if (errorRes.status === 500) {
                        const navigationExtras: NavigationExtras = {
                            state: { error: errorRes.error }
                        };
                        this.router.navigateByUrl('/server-error', navigationExtras);
                    }
                }
                return throwError(errorRes);
            })
        );
    }
}
