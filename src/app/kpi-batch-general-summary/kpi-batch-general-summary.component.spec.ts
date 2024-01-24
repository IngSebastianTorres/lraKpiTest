import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBatchGeneralSummaryComponent } from './kpi-batch-general-summary.component';

describe('KpiBatchGeneralSummaryComponent', () => {
  let component: KpiBatchGeneralSummaryComponent;
  let fixture: ComponentFixture<KpiBatchGeneralSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiBatchGeneralSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiBatchGeneralSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
