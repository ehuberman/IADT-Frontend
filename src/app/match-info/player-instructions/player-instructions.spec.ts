import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInstructions } from './player-instructions';

describe('PlayerInstructions', () => {
  let component: PlayerInstructions;
  let fixture: ComponentFixture<PlayerInstructions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerInstructions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerInstructions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
