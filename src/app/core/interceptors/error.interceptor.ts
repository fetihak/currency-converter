import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse | Error) => {
        let errorMessage = 'An error occurred';

        if (error instanceof HttpErrorResponse) {
          errorMessage = `Error: ${error.status} - ${error.statusText}`;
        } else if (error instanceof ErrorEvent || error instanceof Error) {
          errorMessage = `Error: ${error.message}`;
        } else {
          console.log('Unknown error type:', error);
        }
        this.toastr.error('1111', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  
}

