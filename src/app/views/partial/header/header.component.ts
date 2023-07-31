import {Component} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public openMobileMenu!: boolean;

  constructor(
    private authService: AuthService
  ) {
  }

  public get isLoggedIn(): boolean {
    return !!this.authService.account
  }

  public toggleDropdown(event: any) {
    event.preventDefault(); // Отменяем действие по умолчанию (переход по ссылке)
    let dropdownList: any = document.getElementById("dropdownList");
    if (dropdownList.style.display === "block") {
      dropdownList.style.display = "none";
    } else {
      dropdownList.style.display = "block";
    }
  }

  public signOut(): void {
    this.authService.signOut();
  }
}
