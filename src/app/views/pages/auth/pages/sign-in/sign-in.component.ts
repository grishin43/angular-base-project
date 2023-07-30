import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../../services/toast/toast.service";
import {ADestroyerDirective} from "../../../../../common/abstracts/a-destroyer.directive";

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

    } else {
      this.toastService.show({
        i18nKey: 'errors.fillAllRequiredFields',
        type: "error",
        duration: 5000
      });
    }
  }
}
