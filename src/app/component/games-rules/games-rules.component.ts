import { Component } from '@angular/core';

@Component({
  selector: 'app-games-rules',
  templateUrl: './games-rules.component.html',
  styleUrls: ['./games-rules.component.css']
})
export class GamesRulesComponent {
  points = 0;
  A_points = 0;
  Seven_points = 0;
  K_points = 0;
  J_points = 0;
  Q_points = 0;
  

  calculatePoints(){
    this.points = this.A_points * 11 + this.Seven_points * 10 + this.K_points * 4 + this.J_points * 3 + this.Q_points * 2;
  }

  clearPoints(){
    this.points = 0;
    this.A_points = 0;
    this.Seven_points = 0;
    this.K_points = 0;
    this.J_points = 0;
    this.Q_points = 0;
  }
}
