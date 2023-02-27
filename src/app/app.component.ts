import { Component } from '@angular/core';
import { VtkEngineService } from './vtk-engine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  hasVtkView = true;

  constructor(private vtkEngineService: VtkEngineService) {}

  resetCamera() {
    this.vtkEngineService.resetCamera();
  }

  addCone() {
    this.vtkEngineService.createCone();
  }

  addSphere() {
    this.vtkEngineService.createSphere();
  }

  toggleView() {
    this.hasVtkView = !this.hasVtkView
  }

  removeLastItem() {
    this.vtkEngineService.unRegisterLastItem();
  }

  monitorPoints() {
    this.vtkEngineService.monitorPoints();
  }
}
