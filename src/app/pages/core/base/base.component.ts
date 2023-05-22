import { Component } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/data/auth.service';
import { MenuService } from 'src/app/services/data/menu.service';

@Component({
  selector: 'lib-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent {

  siderToggle = false;

  siderToggleSwitch() {
    this.siderToggle = !this.siderToggle;
  }

  menuSelected = '';

  constructor(
    public menuData: MenuService,
    public router: Router,
    public authService: AuthService,
  ) {
    router.events.subscribe(events => {
      if (events instanceof NavigationEnd) {
        this.menuSelected = events.url;
      }
    });
    if (!authService.isLogin) {
      this.router.navigateByUrl('/auth/login');
    }
  }

  goToLink(url: string) {
    this.router.navigateByUrl(url);
  }

}

