import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBatchCoreComponent } from './kpi-batch-core.component';

describe('KpiBatchCoreComponent', () => {
  let component: KpiBatchCoreComponent;
  let fixture: ComponentFixture<KpiBatchCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiBatchCoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiBatchCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
