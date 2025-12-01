import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'
// import { RouterOutlet } from '@angular/router';
import { MatchInfo } from './match-info/match-info';

@Component({
  selector: 'app-root',
  imports: [MatchInfo, CommonModule ],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('IADT-Frontend');
}
