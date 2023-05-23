import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() icon?: string;

  get iconId(): string {
    if (this.icon === undefined) return '';
    if (this.icon.match('-')) return this.icon;
    return `icon-${this.icon}`;
  }
}
