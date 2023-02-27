import { Component, OnInit, OnDestroy } from '@angular/core';
import { VtkEngineService, Location } from '../vtk-engine.service';
import { Subscription, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit, OnDestroy  {
  subscription: Subscription | null = null;
  private reactiveSubject = new Subject<Location[]>();
  xy: Observable<Location[]> | null = null;

  constructor(private vtkEngineService: VtkEngineService) {}

  ngOnInit(): void {
    const reactiveSubject = this.reactiveSubject;
    this.xy = reactiveSubject.pipe();
    this.subscription = this.vtkEngineService.coords2D.subscribe({
      next(coords) {
        reactiveSubject.next(coords);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
