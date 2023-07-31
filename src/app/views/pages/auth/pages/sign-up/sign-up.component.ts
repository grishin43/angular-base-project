import {Component, Inject, OnInit} from '@angular/core';
import {ADestroyerDirective} from "../../../../../common/abstracts/a-destroyer.directive";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../../services/toast/toast.service";
import {ApiService} from "../../../../../services/api/api.service";
import {IAccountCreate} from "../../../../../common/models/account.model";
import {AuthService} from "../../../../../services/auth/auth.service";
import {IAccountModel} from "../../../../../common/models/domain/models";

export interface SignUpForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends ADestroyerDirective implements OnInit {
  public formGroup!: FormGroup<SignUpForm>;
  public isLoading: boolean = false;
  public currentOrigin!: string;

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private authService: AuthService,
    @Inject(Window) private windowRef: Window
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentOrigin = this.windowRef.window.location.origin;
    this.initForm();
  }

  private initForm(): void {
    this.formGroup = new FormGroup<SignUpForm>({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    })
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      let {confirmPassword, ...body} = this.formGroup.value;
      this.subs.add(
        this.apiService.signUp(body as IAccountCreate)
          .subscribe({
            next: (account: IAccountModel) => {
              this.toastService.show({
                i18nKey: 'common.signUpSuccess',
                type: "success",
                duration: 5000
              });
              this.authService.signIn(account);
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.toastService.show({
                i18nKey: 'errors.incorrectLoginOrPassword',
                type: "error",
                duration: 5000
              });
            }
          })
      )
    } else {
      this.toastService.show({
        i18nKey: 'errors.fillAllRequiredFields',
        type: "error",
        duration: 5000
      });
    }
  }

}

