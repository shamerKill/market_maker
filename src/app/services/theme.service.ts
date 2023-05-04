import { Injectable } from '@angular/core';

export enum ThemeList {
  dark = 'dark',
  default = 'default',
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  private getLink() {
    const id = 'customTheme';
    const link = document.getElementById(id);
    if (link instanceof HTMLLinkElement) {
      return link;
    } else {
      const linkEl = document.createElement('link');
      linkEl.setAttribute('rel', 'stylesheet');
      linkEl.setAttribute('type', 'text/css');
      linkEl.setAttribute('id', id);
      return linkEl;
    }
  }

  onToggle() {
    const link = this.getLink();
    console.log(link.href);
    if (link.href.match(`default.css`)) {
      link.href = `dark.css`;
    } else {
      link.href = `default.css`;
    }
  }

  onChange(theme: ThemeList) {
    this.getLink().href = `${theme}.css`;
  }
}
