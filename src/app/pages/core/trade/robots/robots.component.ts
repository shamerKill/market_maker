import { Component } from '@angular/core';

@Component({
  selector: 'lib-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.scss']
})
export class RobotsComponent {
  checked = false;
  list = [];
  updateAllChecked() {
    console.log(this.checked)
    this.list = this.list.filter((item:any) => item.state);
  }
}
