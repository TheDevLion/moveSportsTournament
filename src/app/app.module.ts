import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { RulesComponent } from './component/rules/rules.component';
import { GeneralClassificationComponent } from './component/general-classification/general-classification.component';
import { EventsDoneComponent } from './component/events-done/events-done.component';
import { AdminTokenComponent } from './component/admin-token/admin-token.component';
import { MainComponent } from './component/main/main.component';
import { ManageParticipantsComponent } from './component/events-done/manage-participants/manage-participants.component';
import { ClassificationTableComponent } from './component/classification-table/classification-table.component';
import { GeneralClassificationViewComponentComponent } from './component/general-classification-view-component/general-classification-view-component.component';
import { EventsViewComponent } from './component/events-view/events-view.component';
import { GamesRulesComponent } from './component/games-rules/games-rules.component';
import { ClockComponent } from './component/clock/clock.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'admin', component: AdminTokenComponent},
  {path: 'tabela', component: GeneralClassificationViewComponentComponent},
  {path: 'eventos', component: EventsViewComponent},
  {path: 'jogos', component: GamesRulesComponent},
  {path: 'relogio', component: ClockComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    GeneralClassificationComponent,
    NavBarComponent,
    RulesComponent,
    EventsDoneComponent,
    MainComponent,
    ManageParticipantsComponent,
    ClassificationTableComponent,
    GeneralClassificationViewComponentComponent,
    EventsViewComponent,
    GamesRulesComponent,
    ClockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppRoutingModule { }
