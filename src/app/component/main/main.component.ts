import { Component } from '@angular/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  title = 'Move Sports League';
  tabNumber: number = 1;

  //Colocar o jogo respectivo de cada etapa (array que aparece nas informações e regras tb)

  changePage(idx: number) {
    this.tabNumber = idx;
  }
}
