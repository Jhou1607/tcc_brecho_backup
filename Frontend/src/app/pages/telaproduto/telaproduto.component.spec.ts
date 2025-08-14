import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaprodutoComponent } from './telaproduto.component';

describe('TelaprodutoComponent', () => {
  let component: TelaprodutoComponent;
  let fixture: ComponentFixture<TelaprodutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaprodutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaprodutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
