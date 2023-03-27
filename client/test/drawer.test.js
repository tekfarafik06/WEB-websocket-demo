import { Drawer } from "../src/drawer";

function create_body() {
  document.body.innerHTML = `
    <div id="body">
    <canvas id="canvas"></canvas>
    <div id="calques"></div>
    </div>
    `;
}

beforeAll(() => {
    console.log("beforeAll")
  create_body();
});

describe("Drawer tests", () => {
  test("Drawer adds a canvas", () => {
    create_body();
    console.log("echo");
    console.log(document.getElementById("body").innerHTML);
    const drawer = new Drawer();
    const canvas = drawer.addCanvas("test");
    expect(canvas.id).toEqual("test");
    expect(canvas.width).toEqual(700);
    expect(canvas.height).toEqual(400);
  });
  test("Drawer adds a main canvas", () => {
    create_body();
    const drawer = new Drawer();
    const canvas = drawer.addCanvas("test", true);
    expect(canvas.id).toEqual("test");
    expect(canvas).toEqual(drawer.mainCanvas);
    expect(canvas.getContext("2d")).toEqual(drawer.mainCtx);
  });
});
