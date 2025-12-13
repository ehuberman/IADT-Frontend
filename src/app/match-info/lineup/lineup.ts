import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LineupService } from './lineup.service';
import { CalendarService } from '../../calendar/calendar.service';

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.html',
  styleUrls: ['./lineup.css'],
  imports: [CommonModule]
})
export class LineupComponent implements OnInit {
  public lineup = signal<Record<string, string[]> | null>(null);
  tacticalApproach: string | null = null;
  playerInstructions: string | null = null;
  constructor(private http: HttpClient, private lineupService: LineupService, private calendarService: CalendarService) {}

  get opponent() {
    return this.calendarService.opponent;
  }

  ngOnInit() {
    this.fetchLineup();
    console.log("lineup: ", this.lineup)
  }

  fetchLineup() {
    this.http.post<any>('http://localhost:8000/chat', {
      prompt: `You are the coach of Argentina's national mens soccer team on ${this.calendarService.date.toDateString()} and we have a match against ${this.calendarService.opponent}. Given ${this.calendarService.opponent}'s recent lineups, results, tactical approaches, I would like for you to generate a recommended formation and lineup for this match. Only return the lineup as a JSON object where the keys are the exactpositions (e.g., 'Goalkeeper', 'Center Back', 'Right Center Midfield', 'Striker', or any other position names) and the values are arrays of player names. Don't responsd with anything else except the JSON object.`
    }).subscribe(response => {
      console.log("Full response: ", response);
      
      // Try to parse JSON from response text first
      if (response.response) {
        this.lineup.set(this.parseLineupFromResponse(response.response));
      }
      
      // If backend already parsed it, use that
      if (response.lineup && typeof response.lineup === 'object') {
        this.lineup.set(response.lineup);
      }
      
      // Don't set to empty object - keep as null if parsing failed
      const currentLineup = this.lineup();
      if (!currentLineup || Object.keys(currentLineup).length === 0) {
        this.lineup.set(null);
      }
      
      this.lineupService.setLineup(this.lineup());
    });
  }

  parseLineupFromResponse(text: string): Record<string, string[]> | null {
    const lineup: Record<string, string[]> = {};


    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        // Ensure all values are arrays
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) {
            lineup[key] = parsed[key];
          } else if (typeof parsed[key] === 'string') {
            lineup[key] = [parsed[key]];
          }
        }
        // Split center backs if multiple
        this.splitCenterBacks(lineup);
        return lineup;
      } catch (e) {
        console.log("Failed to parse JSON, trying text parsing");
      }
    }

    // Fallback: parse text format
    const lines = text.split('\n');
    let currentSection: string | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines, JSON markers, or tactical info
      if (!trimmedLine || trimmedLine.includes('Tactical') || 
          trimmedLine.includes('Formation') || trimmedLine.includes('---') ||
          trimmedLine.length < 2 || trimmedLine === '{' || trimmedLine === '}') {
        continue;
      }

      // Check for position header (e.g., "Goalkeeper:", "Defenders:", etc.)
      const positionMatch = trimmedLine.match(/^([A-Za-z\s]+):\s*(.+)?$/);
      if (positionMatch) {
        const positionName = positionMatch[1].trim();
        currentSection = positionName;
        
        if (!lineup[positionName]) {
          lineup[positionName] = [];
        }

        // If there are players on the same line
        if (positionMatch[2]) {
          const players = this.extractMultiplePlayers(positionMatch[2]);
          lineup[positionName].push(...players);
        }
        continue;
      }

      // If we're in a section, try to extract player names
      if (currentSection && trimmedLine) {
        const players = this.extractMultiplePlayers(trimmedLine);
        if (players.length > 0) {
          lineup[currentSection].push(...players);
        }
      }
    }


    // Split center backs if multiple
    this.splitCenterBacks(lineup);

    return Object.keys(lineup).length > 0 ? lineup : null;
  }

  splitCenterBacks(lineup: Record<string, string[]>): void {
    // Check for "Center Back" position
    if (lineup["Center Back"] && lineup["Center Back"].length > 1) {
      const centerBacks = lineup["Center Back"];
      const midPoint = Math.ceil(centerBacks.length / 2);
      
      // Split into left and right
      lineup["Left Center Back"] = centerBacks.slice(0, midPoint);
      lineup["Right Center Back"] = centerBacks.slice(midPoint);
      
      // Remove the original "Center Back" entry
      delete lineup["Center Back"];
    }
  }

  extractPlayerName(text: string): string | null {
    // Remove common prefixes and suffixes
    let name = text.trim();
    
    // Remove position numbers (e.g., "1. ", "GK: ", etc.)
    name = name.replace(/^\d+\.\s*/, '');
    name = name.replace(/^(GK|DEF|MID|FWD):\s*/i, '');
    
    // Extract name after dash or colon
    const dashMatch = name.match(/[-–—]\s*(.+)/);
    if (dashMatch) {
      name = dashMatch[1].trim();
    }
    
    const colonMatch = name.match(/:\s*(.+)/);
    if (colonMatch) {
      name = colonMatch[1].trim();
    }
    
    // Clean up and return
    name = name.split(',')[0].trim(); // Take first name if comma-separated
    name = name.split(/[–—]/)[0].trim(); // Take first part if dash-separated
    
    return name.length > 0 ? name : null;
  }

  extractMultiplePlayers(text: string): string[] {
    const players: string[] = [];
    
    // Try splitting by comma first
    if (text.includes(',')) {
      const parts = text.split(',');
      for (const part of parts) {
        const player = this.extractPlayerName(part);
        if (player) {
          players.push(player);
        }
      }
    } else {
      // Single player or dash-separated
      const player = this.extractPlayerName(text);
      if (player) {
        players.push(player);
      }
    }
    
    return players;
  }

  getPositionKeys(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!);
  }

  isBackPosition(position: string): boolean {
    const lowerPosition = position.toLowerCase();
    return lowerPosition.includes('back') || lowerPosition.includes('defender') || lowerPosition.includes('center back');
  }

  getBackPositions(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!).filter(pos => this.isBackPosition(pos));
  }

  isGoalkeeperPosition(position: string): boolean {
    const lowerPosition = position.toLowerCase();
    return lowerPosition.includes('goalkeeper') || lowerPosition === 'gk';
  }

  isDefensiveMidfieldPosition(position: string): boolean {
    const lowerPosition = position.toLowerCase();
    return lowerPosition.includes('defensive midfield') || lowerPosition.includes('defensive-midfield');
  }

  getDefensiveMidfieldPositions(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!).filter(pos => this.isDefensiveMidfieldPosition(pos));
  }

  isLeftRightMidfieldPosition(position: string): boolean {
    const lowerPosition = position.toLowerCase();
    return (lowerPosition.includes('left midfield') || lowerPosition.includes('left-midfield') ||
            lowerPosition.includes('right midfield') || lowerPosition.includes('right-midfield')) &&
           !this.isDefensiveMidfieldPosition(position);
  }

  getLeftRightMidfieldPositions(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!).filter(pos => this.isLeftRightMidfieldPosition(pos));
  }

  isAttackingMidfieldPosition(position: string): boolean {
    const lowerPosition = position.toLowerCase();
    return lowerPosition.includes('attacking midfield') || lowerPosition.includes('attacking-midfield');
  }

  getAttackingMidfieldPositions(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!).filter(pos => this.isAttackingMidfieldPosition(pos));
  }

  isForwardPosition(position: string): boolean {
    const lowerPosition = position.toLowerCase();
    return lowerPosition.includes('forward') || lowerPosition.includes('striker') || lowerPosition.includes('wing') || lowerPosition.includes('winger');
  }

  getForwardPositions(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!).filter(pos => this.isForwardPosition(pos));
  }

  getNonBackPositions(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!).filter(pos => 
      !this.isBackPosition(pos) && 
      !this.isGoalkeeperPosition(pos) && 
      !this.isDefensiveMidfieldPosition(pos) &&
      !this.isLeftRightMidfieldPosition(pos) &&
      !this.isAttackingMidfieldPosition(pos) &&
      !this.isForwardPosition(pos)
    );
  }

  getGoalkeeperPositions(): string[] {
    if (!this.lineup()) return [];
    return Object.keys(this.lineup()!).filter(pos => this.isGoalkeeperPosition(pos));
  }

  getPositionClass(position: string): string {
    // Convert position name to lowercase for CSS class
    // console.log("position: ", position);
    return position.toLowerCase().replace(/\s+/g, '-');
  }

  getPlayersForPosition(position: string): string[] {
    if (!this.lineup()) return [];
    return this.lineup()?.[position] || [] ;
  }
  // fetchTacticalApproach() {
  //   this.http.post<any>('http://localhost:8000/prompt', {
  //     messages: [
  //       { role: 'user', content: "You are the coach of Argentina's national mens soccer team today July 26, 2025 and we have a match against Brazil. Given Brazil's recent lineups, results, tactical approaches, I would like for you to generate a tactical approach for this match. Only return the tactical approach, no other text." }
  //     ]
  //   }).subscribe(response => {
  //     this.tacticalApproach = response.tacticalApproach;
  //   });
  // }
  // fetchPlayerInstructions() {
  //   this.http.post<any>('http://localhost:8000/prompt', {
  //     messages: [
  //       { role: 'user', content: "You are the coach of Argentina's national mens soccer team today July 26, 2025 and we have a match against Brazil. Given Brazil's recent lineups, results, tactical approaches, I would like for you to generate a recommended player instructions for this match. Only return the player instructions, no other text." }
  //     ]
  //   }).subscribe(response => {
  //     this.playerInstructions = response.playerInstructions;
  //   });
  // }
}
