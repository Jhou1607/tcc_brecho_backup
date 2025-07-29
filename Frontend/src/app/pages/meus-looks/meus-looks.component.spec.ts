import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusLooksComponent } from './meus-looks.component';

describe('MeusLooksComponent', () => {
  let component: MeusLooksComponent;
  let fixture: ComponentFixture<MeusLooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusLooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeusLooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
