import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // constructor(private toastr: ToastrService) {}
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error: ${error.status} - ${error.statusText}`;
        }
        // this.toastr.error(errorMessage, 'Error', {
        //   timeOut: 3000, // Dismiss after 3 seconds
        //   positionClass: 'toast-top-right', // Position of toast notification
        // });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  
}

