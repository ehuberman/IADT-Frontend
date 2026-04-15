import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarService } from './calendar.service';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar {
  constructor(private calendarService: CalendarService, private router: Router) {}

  matches = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [
      { title: 'vs Algeria - 9:00 PM', start: '2026-06-16' },
      { title: 'vs Austria - 1:00 PM', start: '2026-06-22' },
      { title: 'vs Jordan - 10:00 PM', start: '2026-06-27' }
    ],
    eventClick: (info: any) => {
      this.calendarService.opponent = info.event.title.split(" ")[1];
      this.calendarService.date = info.event.start;
      this.router.navigate(['/match-info']);
    }
  };
}
