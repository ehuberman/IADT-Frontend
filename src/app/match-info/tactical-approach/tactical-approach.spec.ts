import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticalApproach } from './tactical-approach';

describe('TacticalApproach', () => {
  let component: TacticalApproach;
  let fixture: ComponentFixture<TacticalApproach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacticalApproach]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacticalApproach);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
