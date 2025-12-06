import { Component } from '@angular/core';

@Component({
  selector: 'app-general-classification',
  templateUrl: './general-classification.component.html',
  styleUrls: ['./general-classification.component.css']
})
export class GeneralClassificationComponent {
  refreshFlag: boolean = true;

  refreshPage(){
    this.refreshFlag = !this.refreshFlag;
  }  

}
