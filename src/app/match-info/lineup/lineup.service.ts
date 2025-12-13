import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineupService {
  lineup: Record<string, string[]> | null = null;
  lineup$ = new BehaviorSubject<Record<string, string[]> | null>(null);
  
  // When lineup is set, emit it
  setLineup(lineup: Record<string, string[]> | null) {
    this.lineup = lineup;
    this.lineup$.next(lineup);
  }
}

