import { Routes } from '@angular/router';
import { Calendar } from './calendar/calendar';
import { MatchInfo } from './match-info/match-info';

export const routes: Routes = [
    {path: '', redirectTo: '/matches', pathMatch: 'full'},
    {path: 'matches', component: Calendar},
    {path: 'match-info', component: MatchInfo}
];
