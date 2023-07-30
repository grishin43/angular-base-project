import {Component, Inject, OnInit} from '@angular/core';
import {ADestroyerDirective} from "../../../../../common/abstracts/a-destroyer.directive";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../../services/toast/toast.service";

export interface SignUpForm {
  fullName: FormControl<string | null>;
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
      fullName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    })
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {

    } else {
      this.toastService.show({
        i18nKey: 'errors.fillAllRequiredFields',
        type: "error",
        duration: 5000
      });
    }
  }
}

