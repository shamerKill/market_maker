import { Component } from '@angular/core';

@Component({
  selector: 'lib-robot-list',
  templateUrl: './robot-list.component.html',
  styleUrls: ['./robot-list.component.scss']
})
export class RobotListComponent {
  isVisible = false;
  selectedValue = null;
  value='';
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
}
