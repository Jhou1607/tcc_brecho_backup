import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookNameModalComponent } from './look-name-modal.component';

describe('LookNameModalComponent', () => {
  let component: LookNameModalComponent;
  let fixture: ComponentFixture<LookNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookNameModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
