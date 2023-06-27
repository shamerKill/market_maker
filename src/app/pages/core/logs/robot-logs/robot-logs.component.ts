import { Component } from '@angular/core';

@Component({
  selector: 'lib-robot-logs',
  templateUrl: './robot-logs.component.html',
  styleUrls: ['./robot-logs.component.scss']
})
export class RobotLogsComponent {
  date = null;
  selectedValue = null;
  value = '';
  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }
}
