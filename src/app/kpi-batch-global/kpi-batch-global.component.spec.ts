import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBatchGlobalComponent } from './kpi-batch-global.component';

describe('KpiBatchGlobalComponent', () => {
  let component: KpiBatchGlobalComponent;
  let fixture: ComponentFixture<KpiBatchGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiBatchGlobalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiBatchGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
