export class Drawer {
  constructor() {
    this.calques = document?.getElementById("calques");
    this.mainCanvas = document?.getElementById("canvas");
    this.mainCtx = this.mainCanvas?.getContext("2d");
    if (this.mainCanvas) {
      this.mainCanvas.width = 700;
      this.mainCanvas.height = 400;
    }
  }

  addCanvas(id, isMain = false) {
    if (isMain) {
      this.mainCanvas.id = id;
      return this.mainCanvas;
    }
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = 700;
    canvas.height = 400;
    this.calques.appendChild(canvas);
    return canvas;
  }
}

export default new Drawer();
