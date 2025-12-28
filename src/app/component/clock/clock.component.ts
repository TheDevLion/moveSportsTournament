import { Component } from '@angular/core';
import { min } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent {
  teamA_clock = 300;
  teamB_clock = 300;

  team = "B";
  A_SetInterval: any;
  B_SetInterval: any;

  pause = true;

  teamA_penalties = 0;
  teamB_penalties = 0;

  lock = false;
  losingTeam = "";

  milisec = 0;
  milisec_SetInterval: any;

  startMilisec(){
    this.milisec_SetInterval = window.setInterval(() => {
      if (this.milisec < 9) 
        this.milisec++; 
      else this.milisec = 0;
    }, 93);
  }

  stopMilisec(){
    window.clearInterval(this.milisec_SetInterval);
    this.milisec = 0;
  }


  intToTime(num: number){
    let minutes = Math.trunc(num/60);
    let seconds = num % 60;

    let minutesFormatted = minutes.toString().padStart(2, "0");
    let secondsFormatted = seconds.toString().padStart(2, "0");

    return `${minutesFormatted}:${secondsFormatted}`
  }

  timeToInt(time: string){
    let minutes = Number(time.split(":")[0]);
    let seconds = Number(time.split(":")[1]);

    return minutes * 60 + seconds;

  }

  clockAction(){
    if (this.team === "A")
    {
      this.A_SetInterval = window.setInterval(() => {(this.teamA_clock--), this.checkLock();}, 1000);
      this.B_SetInterval ? window.clearInterval(this.B_SetInterval) : "";
      this.team = "B";
    }
    else if (this.team === "B")
    {
      this.B_SetInterval = window.setInterval(() => {(this.teamB_clock--), this.checkLock();}, 1000);
      this.A_SetInterval ? window.clearInterval(this.A_SetInterval) : "";
      this.team = "A";
    }
    this.pause = false;
    this.stopMilisec();
    this.startMilisec();
  }

  pauseAction(){    
    if(!this.pause){
      this.B_SetInterval ? window.clearInterval(this.B_SetInterval) : "";
      this.A_SetInterval ? window.clearInterval(this.A_SetInterval) : "";
  
      this.team = this.team === "A" ? "B" : "A";      
      this.pause = true;
      this.stopMilisec();
    }else{
      this.clockAction();
      this.pause = false;
    }    
  }

  resetAction(){
    this.teamA_clock = 300;
    this.teamB_clock = 300;

    this.teamA_penalties = 0;
    this.teamB_penalties = 0;

    this.B_SetInterval ? window.clearInterval(this.B_SetInterval) : "";
    this.A_SetInterval ? window.clearInterval(this.A_SetInterval) : "";

    this.team = "B";
    this.lock = false;
    this.losingTeam = "";
    this.pause = true;
    this.stopMilisec();
  }

  penaltyTeam(team: string){
    this.pause = false;
    this.pauseAction();
    if (team === "A"){
      this.teamA_clock = this.teamA_clock >= 45 ? this.teamA_clock - 45 : 0;
      this.team = "B";
      this.teamA_penalties += 1;
    }
    if (team === "B"){
      this.teamB_clock = this.teamB_clock >= 45 ? this.teamB_clock - 45 : 0;
      this.team = "A";
      this.teamB_penalties += 1;
    }
    this.checkLock();
    this.stopMilisec();
  }

  checkLock(){
    if(this.teamA_clock <= 0){
      this.teamA_clock = 0;
      this.lock = true;
      this.losingTeam = "A";      
      this.beep();
      this.stopMilisec();
    }
    else if(this.teamB_clock <= 0){
      this.teamB_clock = 0;
      this.lock = true;
      this.losingTeam = "B";      
      this.beep();
      this.stopMilisec();
    }
    

  }

  beep(){
    let context = new AudioContext();
    let oscillator = context.createOscillator();
    let contextGain = context.createGain();
    let x = 0.4;
      
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);

    contextGain.gain.exponentialRampToValueAtTime(
      0.00001, context.currentTime + x
    );
  }

}
