import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarService } from './calendar.service';
// import { CalendarInterface } from './calendar.interface';
import { Router, RouterOutlet } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  imports: [  FullCalendarModule  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar {
  constructor(private calendarService: CalendarService, private router: Router){}

  matches = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [
      { title: 'vs Algeria - 9:00 PM', start: '2026-06-16' },
      { title: 'vs Austria - 1:00 PM', start: '2026-06-22' },
      { title: 'vs Jordan - 10:00 PM', start: '2026-06-27' }
    ],
    eventClick: (info: any) => {
      let opponent = info.event.title.split(" ")[1]
      this.calendarService.opponent = opponent
      this.calendarService.date = info.event.start
      console.log("opponent: ", this.calendarService.opponent)
      this.router.navigate(['/match-info'])
    }
  }
  
  // matches: CalendarInterface = {
  //   initialView: 'dayGridMonth',
  //   initialDate: '2026-06-01',
  //   plugins: [dayGridPlugin],
  //   events: []
  // }
  
  // constructor(private calendar: CalendarService) {}
  
  // ngOnInit() {
  //   this.getMatches();
  // }

  // getMatches() {
  //   this.calendar.getMatches().subscribe((data) => {
  //     const events = data.map(d => ({
  //       title: `vs ${d.opponent} - ${d.time}`,
  //       start: d.date
  //     }));
  //     this.matches = { ...this.matches, events };
  //     console.log("events: ", this.matches.events);
  //   });
  // }

  // buildCalendar() {

  // }
}
