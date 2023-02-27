import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VtkViewComponent } from './vtk-view.component';

describe('VtkViewComponent', () => {
  let component: VtkViewComponent;
  let fixture: ComponentFixture<VtkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VtkViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VtkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
