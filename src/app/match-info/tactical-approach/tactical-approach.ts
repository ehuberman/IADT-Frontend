import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LineupService } from '../lineup/lineup.service';
import { CalendarService } from '../../calendar/calendar.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tactical-approach',
  imports: [],
  templateUrl: './tactical-approach.html',
  styleUrl: './tactical-approach.css'
})
export class TacticalApproach {
  tacticalApproach = signal<string | null>(null);
  constructor(private http: HttpClient, private lineup: LineupService, private calendar: CalendarService){}

  ngOnInit() {
    // Wait for lineup to be populated
    this.lineup.lineup$.subscribe(lineup => {
      if (lineup != null) {
        this.fetchApproach();
      }
    });
  }
  fetchApproach () {
    this.http.post<any>(`${environment.apiUrl}/chat`, {
      prompt: `You are the coach of Argentina's national mens soccer team on ${this.calendar.date.toDateString()}, and we have a match against ${this.calendar.opponent}. Here is our lineup: ${JSON.stringify(this.lineup.lineup)}. Given ${this.calendar.opponent}'s recent lineups, results, tactical approaches, I would like for you to generate a tactical approach for this match. Start off by returning the overall tactical approach for the team, then an instruction for each player. Use the players and the positions from the lineup provided earlier`
    }).subscribe(response => {
      console.log("response: ", response)
      this.tacticalApproach.set(response.response);
      console.log("tactical approach: ", this.tacticalApproach)
    });
  }
}
