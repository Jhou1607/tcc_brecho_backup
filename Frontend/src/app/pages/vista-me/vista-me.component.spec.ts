import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMeComponent } from './vista-me.component';

describe('VistaMeComponent', () => {
  let component: VistaMeComponent;
  let fixture: ComponentFixture<VistaMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
