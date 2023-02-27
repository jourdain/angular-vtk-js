import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { VtkViewComponent } from './vtk-view/vtk-view.component'

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPixelSpaceCallbackMapper from '@kitware/vtk.js/Rendering/Core/PixelSpaceCallbackMapper';

interface VtkSceneItem {
  actor: vtkActor,
  source: any,
  mapper: vtkMapper,
}

export interface Location {
  i: number,
  x: number,
  y: number,
}



@Injectable({
  providedIn: 'root'
})
export class VtkEngineService {
  scene: Array<VtkSceneItem> = [];
  view: VtkViewComponent| null = null;
  private coords2DProducer = new Subject<Array<Location>>();
  coords2D: Observable<Array<Location>>;

  constructor() {
    this.coords2D = this.coords2DProducer.pipe()
  }

  registerView(view:VtkViewComponent) {
    if (this.view) {
      for (let sceneItem of this.scene) {
        this.view.renderer.removeActor(sceneItem.actor);
      }
    }
    console.log("VtkEngineService::registerView");
    this.view = view;

    if (this.view) {
      for (let sceneItem of this.scene) {
        this.view.renderer.addActor(sceneItem.actor);
      }
      this.view.renderWindow.render();
    }
  }

  monitorPoints() {
    if (this.scene.length) {
      console.log("monitor");
      const mapper = vtkPixelSpaceCallbackMapper.newInstance();
      const source = this.scene[this.scene.length - 1].source;
      mapper.setInputConnection(source.getOutputPort());

      // To go around invalid vtk.js typescript definition...
      const coords2DProducer = this.coords2DProducer;
      const view = this.view;

      mapper.setCallback(function () {
        const [w, h] = view?.openGLRenderWindow.getSize() || [10, 10];
        const toLocation = (v: number[], i: number) => ({i, x:v[0], y:h - v[1]});
        const coords: number[][] = arguments[0];
        coords2DProducer.next(coords.map(toLocation));
      });
      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);
      this.registerSceneItem({ source, mapper, actor});
    }
  }

  unRegisterView(view:VtkViewComponent) {
    if (this.view) {
      for (let sceneItem of this.scene) {
        this.view.renderer.removeActor(sceneItem.actor);
      }
    }
    console.log("VtkEngineService::unRegisterView");
    this.view = null;
  }

  registerSceneItem(item: VtkSceneItem) {
    this.scene.push(item);
    if (this.view) {
      this.view.renderer.addActor(item.actor);
      this.view.renderWindow.render();
    }
  }

  unRegisterLastItem() {
    if (this.scene.length) {
      const sceneItem = this.scene.pop();
      if (this.view && sceneItem) {
        this.view.renderer.removeActor(sceneItem.actor);
        this.view.renderWindow.render();
      }
      return true;
    }
    return false;
  }

  createCone() {
    const source = vtkConeSource.newInstance();
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(source.getOutputPort());
    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);
    this.registerSceneItem({ source, mapper, actor});
  }


  createSphere() {
    const source = vtkSphereSource.newInstance();
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(source.getOutputPort());
    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);
    this.registerSceneItem({ source, mapper, actor});
  }

  resetCamera() {
    if (this.view) {
      this.view.renderer.resetCamera();
      this.view.renderWindow.render();
    }
  }
}
