import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'lib-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  pageType: 'login' | 'register' = 'login';


  constructor(public router: Router) {
    // watch the router url change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(item => (item as NavigationEnd).url)
    ).subscribe(url => {
      if (url.match('register')) {
        this.pageType = 'register';
      } else {
        this.pageType = 'login';
      }
    });
  }

  ngOnInit() {
  }


  onAuthToggle() {
    console.log(this.pageType)
    if (this.pageType === 'login') {
      this.router.navigate(['auth/register']);
    } else {
      this.router.navigate(['auth/login']);
    }
  }

}
