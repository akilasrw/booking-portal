import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { from, Observable, Subscription, throwError, timer } from 'rxjs';
import { catchError, map, mergeMap, retryWhen, take } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/_models/user.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor { // ,OnDestroy

 // subscription!: Subscription;
 // subscription2!: Subscription;
  currentUser!: User | null;

  constructor(private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen(errors => {
        return errors
          .pipe(
            mergeMap(error => error.status === 404 ? timer(5000) : throwError(error)),
            take(3)
          );
      }),
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else {
                this.toastr.error(error.error, error.status);
              }
              break;
            case 401:
              if(error.error)
                this.accountService.logout(error.error);
              else
                this.accountService.logout('Unauthorized Access');
              break;
            case 403:
              this.toastr.error('Unauthorized Access.');
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: { error: error.error } };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            case 460:
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);

              break;
          }
        }
        return throwError(error);
      })
    );
  }

  //getCurrentUser(): Promise<boolean> {
    // return new Promise((resolve) => {
    //   this.subscription = this.accountService.currentUser$.subscribe(res => {
    //     this.currentUser = res;
    //     resolve(true);
    //   })
    // });

 // }

 getCurrentUserToken(): Observable<string> {
  return this.accountService.currentUser$.pipe(map(e => {
    if (e) {
      return e.refreshToken!;
    }
    else {
      return '';
    }
  }));
}
// ngOnDestroy() {
//   this.subscription.unsubscribe();
//   this.subscription2.unsubscribe();
// }
}
