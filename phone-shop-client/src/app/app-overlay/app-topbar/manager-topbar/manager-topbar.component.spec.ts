import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTopbarComponent } from './manager-topbar.component';

describe('ManagerTopbarComponent', () => {
  let component: ManagerTopbarComponent;
  let fixture: ComponentFixture<ManagerTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTopbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
