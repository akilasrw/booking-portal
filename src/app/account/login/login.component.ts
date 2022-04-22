import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl = '';
  public loginForm!: FormGroup;
  isSubmitting = false;
  show: boolean = false;

  constructor(public accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.accountService.login(this.loginForm.value).subscribe(
        res => {
          this.router.navigate([this.returnUrl]);
          console.log('Successfully logged.');

        },
        err => {
          this.isSubmitting = false;
        })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
