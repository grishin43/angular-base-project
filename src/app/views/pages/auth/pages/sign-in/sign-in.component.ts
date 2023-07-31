import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../../services/toast/toast.service";
import {ADestroyerDirective} from "../../../../../common/abstracts/a-destroyer.directive";
import {ApiService} from "../../../../../services/api/api.service";
import {ISessionCreateDTO} from "../../../../../common/models/domain/dto/session.dto";
import {IAccountModel} from "../../../../../common/models/domain/models";
import {AuthService} from "../../../../../services/auth/auth.service";

export interface SignInForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends ADestroyerDirective implements OnInit {
  public formGroup!: FormGroup<SignInForm>;
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
    this.formGroup = new FormGroup<SignInForm>({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      this.subs.add(
        this.apiService.signIn(this.formGroup.value as ISessionCreateDTO)
          .subscribe({
            next: (account: IAccountModel) => {
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
