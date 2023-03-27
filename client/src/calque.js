export class Calque {
  constructor(id, name, canvas, sendMessage) {
    this.id = id;
    this.name = name;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.isDrawing = false;
    this.pos = { x: 0, y: 0 };
    this.sendMessage = sendMessage;
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvas.style = "border: 1px solid black;";
    this.ctx.font = "30px serif";
    this.ctx.fillText(this.name, 530, 370, 150);
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  onMouseDown(e) {
    this.isDrawing = true;
    this.pos = this.getMousePos(e);
  }

  onMouseMove(e) {
    if (this.isDrawing) {
      const newPos = this.getMousePos(e);
      this.sendMessage({
        id: this.id,
        canvas: this.name,
        oldPos: this.pos,
        newPos: newPos,
      });
      this.pos = newPos;
    }
  }

  onMouseUp(e) {
    if (this.isDrawing) {
      const newPos = this.getMousePos(e);
      this.sendMessage({
        id: this.id,
        canvas: this.name,
        oldPos: this.pos,
        newPos: newPos,
      });
      this.pos = newPos;
      this.isDrawing = false;
    }
  }

  draw(oldPos, newPos, color) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(oldPos.x, oldPos.y);
    this.ctx.lineTo(newPos.x, newPos.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  close() {
    this.canvas.remove();
  }
}
