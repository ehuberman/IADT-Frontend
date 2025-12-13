import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { LineupComponent } from './lineup/lineup';
import { TacticalApproach } from "./tactical-approach/tactical-approach";

@Component({
  selector: 'app-match-info',
  imports: [CommonModule, LineupComponent, TacticalApproach],
  templateUrl: './match-info.html',
  styleUrl: './match-info.css',
  standalone:true
})
export class MatchInfo {

}
