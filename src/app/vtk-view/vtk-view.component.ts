import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { VtkEngineService  } from '../vtk-engine.service';

import '@kitware/vtk.js/Rendering/OpenGL/Profiles/Geometry';

import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';


import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkMouseCameraTrackballRotateManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballRotateManipulator';
import vtkMouseCameraTrackballZoomManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomManipulator';
import vtkInteractorStyle from '@kitware/vtk.js/Rendering/Core/InteractorStyle';

@Component({
  selector: 'app-vtk-view',
  template: '',
  styleUrls: ['./vtk-view.component.css']
})
export class VtkViewComponent implements OnInit, OnDestroy {
  renderWindow:vtkRenderWindow;
  renderer:vtkRenderer;
  openGLRenderWindow:vtkOpenGLRenderWindow;
  interactor:vtkRenderWindowInteractor;
  style:vtkInteractorStyleManipulator;
  resizeObserver:ResizeObserver;

  constructor(private element: ElementRef, private engineService: VtkEngineService) {
    console.log("VtkView::constructor");
    this.renderWindow = vtkRenderWindow.newInstance();
    this.renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
    this.renderWindow.addRenderer(this.renderer);

    this.openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    this.renderWindow.addView(this.openGLRenderWindow);

    this.style = vtkInteractorStyleManipulator.newInstance();
    this.style.addMouseManipulator(vtkMouseCameraTrackballRotateManipulator.newInstance());
    this.style.addMouseManipulator(vtkMouseCameraTrackballPanManipulator.newInstance({ shift: true }));
    this.style.addMouseManipulator(vtkMouseCameraTrackballPanManipulator.newInstance({ alt: true }));
    this.style.addMouseManipulator(vtkMouseCameraTrackballZoomManipulator.newInstance({ control: true }));
    this.style.addMouseManipulator(vtkMouseCameraTrackballZoomManipulator.newInstance({ scrollEnabled: true }));

    this.interactor = vtkRenderWindowInteractor.newInstance();
    this.interactor.setView(this.openGLRenderWindow);
    this.interactor.setInteractorStyle(this.style);

    this.resizeObserver = new ResizeObserver(() => this.updateSize());
  }

  ngOnInit() {
    const container = this.element.nativeElement;
    container.style = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }
    console.log("VtkView::ngOnInit", container);
    this.openGLRenderWindow.setContainer(container);
    this.openGLRenderWindow.setSize(300, 300);
    this.interactor.bindEvents(container);
    this.interactor.initialize();

    this.engineService.registerView(this);
    this.resizeObserver.observe(container.parentElement);
  }

  ngOnDestroy() {
    const container = this.element.nativeElement;
    this.resizeObserver.unobserve(container);

    this.resizeObserver.disconnect();
    this.engineService.unRegisterView(this);

    console.log("VtkView::ngOnDestroy");
    this.openGLRenderWindow.delete();
    this.renderWindow.delete();
    this.interactor.delete();
    this.renderer.delete();
  }

  updateSize() {
      const container = this.element.nativeElement.parentElement;
      const { width, height } = container.getBoundingClientRect();
      this.openGLRenderWindow.setSize(Math.floor(width), Math.floor(height));
      this.renderWindow.render();
  }
}
