import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../_services/token.service';
import { AuthService } from 'src/app/service/auth.service';
import { LoginUsuario } from 'src/app/models/login-usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  defaultAuth: any = {
    email: '',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  roles: string[] = [];
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  isLogged = false;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private tokenService: TokenService,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // redirect to home if already logged in
    if (this.tokenService.getUser()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    if (this.tokenService.getToken()) {
      this.router.navigate([this.returnUrl]);
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(255), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    this.isLoadingSubject.next(true);
    const loginUsuario = new LoginUsuario(this.f.email.value, this.f.password.value);
    const loginSubscr = this.authService
      .login(loginUsuario)
      .pipe(first())
      .subscribe(
        (response) => {
          this.isLogged = true;
          this.hasError = false;

          this.tokenService.setToken(response.token);
          this.tokenService.setUser(response.usuario);
          this.tokenService.setAuthorities(response.authorities);
          this.roles = response.authorities;
          this.isLoadingSubject.next(false);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.isLoadingSubject.next(false);
          this.hasError = true;
          this.isLogged = false;
        }
      );
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
