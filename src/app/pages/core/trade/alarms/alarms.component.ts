import { Component } from '@angular/core';

@Component({
  selector: 'lib-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent {
  isVisible = false;
  selected = 'lBank';
  selectedValue = 'PC';
  selectedValue1 = 'USDT';
  value='';
  radioValue = 'A';
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  submitStart() :void{
    console.log(this.selectedValue1)
  }
}
