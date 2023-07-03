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
    if (result.length == 0) return
    console.log('onChange: ', result);
    console.log('onChange: ', Number(result[0]));
    console.log('onChange: ', result[0].toLocaleDateString());
  }
}
