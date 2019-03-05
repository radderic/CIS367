import createContext from 'gl-context';
import createGeometry from 'gl-geometry';
import createShader from 'gl-shader-core';
import fsOne from './shaders/fs_onecolor.glsl';
import vsOne from './shaders/vs_onecolor.glsl';
import vsMulti from './shaders/vs_vertexcolor.glsl';
import fsMulti from './shaders/fs_vertexcolor.glsl';

let pink_ghost, blue_ghost;
let pacman;
let wall;
let food;
let blue_eyel, blue_eyer;
let blue_irisl, blue_irisr;
let pink_eyel, pink_eyer;
let pink_irisl, pink_irisr;
let cherry1, cherry2;
let stem;

let oneColorShader = null;
let multiColorShader = null;
const POINTS_ON_CIRCLE = 10;

function renderFunc() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  if (oneColorShader) {
    pacman.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [1.0, 1.0, 0.0]; // 70% green
    pacman.draw(gl.TRIANGLE_FAN);
    pacman.unbind();

    wall.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [0.0, 0.0, 0.8]; // 70% green
    wall.draw(gl.LINES);
    wall.unbind();

    food.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [1.0, 1.0, 1.0]; // 70% green
    food.draw(gl.POINTS);
    food.unbind();

    pink_irisr.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [0.0, 0.0, 0.0]; // 70% green
    pink_irisr.draw(gl.TRIANGLE_FAN);
    pink_irisr.unbind();

    pink_eyer.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [1.0, 1.0, 1.0]; // 70% green
    pink_eyer.draw(gl.TRIANGLE_FAN);
    pink_eyer.unbind();

    pink_irisl.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [0.0, 0.0, 0.0]; // 70% green
    pink_irisl.draw(gl.TRIANGLE_FAN);
    pink_irisl.unbind();

    pink_eyel.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [1.0, 1.0, 1.0]; // 70% green
    pink_eyel.draw(gl.TRIANGLE_FAN);
    pink_eyel.unbind();

    blue_irisr.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [0.0, 0.0, 0.0]; // 70% green
    blue_irisr.draw(gl.TRIANGLE_FAN);
    blue_irisr.unbind();

    blue_eyer.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [1.0, 1.0, 1.0]; // 70% green
    blue_eyer.draw(gl.TRIANGLE_FAN);
    blue_eyer.unbind();

    blue_irisl.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [0.0, 0.0, 0.0]; // 70% green
    blue_irisl.draw(gl.TRIANGLE_FAN);
    blue_irisl.unbind();

    blue_eyel.bind(oneColorShader);
    oneColorShader.uniforms.pixelColor = [1.0, 1.0, 1.0]; // 70% green
    blue_eyel.draw(gl.TRIANGLE_FAN);
    blue_eyel.unbind();

  }

  if (multiColorShader) {
    pink_ghost.bind(multiColorShader);
    pink_ghost.draw(gl.TRIANGLE_STRIP);
    pink_ghost.unbind();

    blue_ghost.bind(multiColorShader);
    blue_ghost.draw(gl.TRIANGLE_STRIP);
    blue_ghost.unbind();

    cherry1.bind(multiColorShader);
    cherry1.draw(gl.TRIANGLES);
    cherry1.unbind();

    cherry2.bind(multiColorShader);
    cherry2.draw(gl.TRIANGLES);
    cherry2.unbind();

    stem.bind(multiColorShader);
    stem.draw(gl.TRIANGLES);
    stem.unbind();

  }
}

// Setup canvas and its render function
const canvas = document.getElementById('mycanvas');
const gl = createContext(canvas, {}, renderFunc);
const width = gl.drawingBufferWidth;
const height = gl.drawingBufferHeight;

gl.viewport(0, 0, width, height); // Use the entire canvas for our viewport
gl.clearColor(0.0, 0.0, 0.0, 1); // Use black to clear the canvas

gl.enable(gl.DEPTH_TEST); // Use DEPTH buffer for hidden surface removal

// Prepare data for different shapes
pink_ghost = createGeometry(gl).attr(
  'vertexPos',
  [
      [-0.7, -0.25, 0.0], //upper quad
      [-0.6, -0.15, 0.0],
      [-0.6, -0.25, 0.0],
      [-0.4, -0.15, 0.0],
      [-0.4, -0.25, 0.0],
      [-0.3, -0.25, 0.0],

      [-0.3, -0.75, 0.0], //lower triangles
      [-0.4, -0.25, 0.0],
      [-0.4, -0.65, 0.0],
      [-0.6, -0.25, 0.0],
      [-0.5, -0.75, 0.0],
      [-0.7, -0.25, 0.0],
      [-0.6, -0.65, 0.0],
      [-0.7, -0.75, 0.0],
  ],
  { size: 3 }
).attr('vertexCol', [
    [0.8, 0.3, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.5, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.5, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.5, 0.7],
    [0.8, 0.3, 0.7],
    [0.8, 0.5, 0.7],
    [0.8, 0.5, 0.7],
], { size: 3 });

blue_ghost = createGeometry(gl).attr(
  'vertexPos',
  [
      [-0.2, -0.25, 0.0], //upper quad
      [-0.1, -0.15, 0.0],
      [-0.1, -0.25, 0.0],
      [0.1, -0.15, 0.0],
      [0.1, -0.25, 0.0],
      [0.2, -0.25, 0.0],

      [0.2, -0.75, 0.0], //lower triangles
      [0.1, -0.25, 0.0],
      [0.1, -0.65, 0.0],
      [-0.1, -0.25, 0.0],
      [0.0, -0.75, 0.0],
      [-0.2, -0.25, 0.0],
      [-0.1, -0.65, 0.0],
      [-0.2, -0.75, 0.0],
  ],
  { size: 3 }
).attr('vertexCol', [
    [0.0, 0.8, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.2, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.2, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.2, 1.0],
    [0.0, 0.8, 1.0],
    [0.0, 0.2, 1.0],
    [0.0, 0.2, 1.0],
], { size: 3 });

wall = createGeometry(gl).attr(
  'vertexPosition',
  [
    [-1.0, 0.9, 0.0],
    [1.0, 0.9, 0.0],
    [1.0, -0.9, 0.0],
    [-1.0, -0.9, 0.0],
    [-1.0, 0.05, 0.0],
    [1.0, 0.05, 0.0],
    [-1.0, -0.05, 0.0],
    [1.0, -0.05, 0.0],
  ], { size: 3 });


food = createGeometry(gl).attr(
  'vertexPosition',
  [
    [-0.8, 0.45, 0.0],
    [-0.4, 0.45, 0.0],
    [0.4, 0.45, 0.0],
    [0.8, 0.45, 0.0],
  ], { size: 3});

cherry1 = createGeometry(gl).attr(
  'vertexPos',
  [
    [ 0.1, 0.53, 0.2 ],
    [ -0.1, 0.5, 0.0 ],
    [ 0.0, 0.3, 0.0 ],
  ], {size : 3}
).attr('vertexCol', [
    [ 0.7, 0.0, 0.0 ],
    [ 0.2, 0.0, 0.0 ],
    [ 0.2, 0.0, 0.0 ],
], {size:3});

cherry2 = createGeometry(gl).attr(
  'vertexPos',
  [
    [ 0.2, 0.5, 0.0 ],
    [ -0.05, 0.53, 0.0 ],
    [ 0.1, 0.3, 0.0 ],
  ], {size : 3}
).attr('vertexCol', [
    [ 1.0, 0.0, 0.0 ],
    [ 0.3, 0.0, 0.0 ],
    [ 0.3, 0.0, 0.0 ],
], {size:3});

stem = createGeometry(gl).attr(
  'vertexPos',
  [
    [ 0.1, 0.65, 0.3 ],
    [ -0.05, 0.65, 0.3 ],
    [ 0.05, 0.45, -0.1 ],
  ], {size : 3}
).attr('vertexCol', [
    [ 0.2, 0.2, 0.0 ],
    [ 0.2, 0.2, 0.0 ],
    [ 0.0, 0.0, 0.0 ],
], {size:3});

function generatePacmanVertices(ctrx, ctry, numPoints) {
  let startx = .3;
  let starty = .3;
  let arr = [ctrx, ctry, 0]; // At z = 0
  for (let k = 1; k < numPoints; k++) {
    const angle = (k / numPoints) * 2 * Math.PI;
    const xVal = startx * Math.cos(angle);
    const yVal = starty * Math.sin(angle);
    arr.push(ctrx + xVal, ctry + yVal, 0.0); // At z=0
  }
  return arr;
}

function generateCircleVertices(ctrx, ctry, radius, numPoints) {
  let arr = [ctrx, ctry, 0]; // At z = 0
  for (let k = 0; k < numPoints + 1; k++) {
    const angle = (k / numPoints) * 2 * Math.PI;
    const xVal = radius * Math.cos(angle);
    const yVal = radius * Math.sin(angle);
    arr.push(ctrx + xVal, ctry + yVal, 0.0); // At z=0
  }
  return arr;
}

const circleVertices = generatePacmanVertices(
  0.6, // center-x
  -0.45, // center-y
  POINTS_ON_CIRCLE
);

const pinkEyeRVertices = generateCircleVertices(
  -0.4, // center-x
  -0.3, // center-y
  0.05,
  POINTS_ON_CIRCLE
);

const pinkIrisRVertices = generateCircleVertices(
  -0.37, // center-x
  -0.3, // center-y
  0.025,
  POINTS_ON_CIRCLE
);

const pinkEyeLVertices = generateCircleVertices(
  -0.6, // center-x
  -0.3, // center-y
  0.05,
  POINTS_ON_CIRCLE
);

const pinkIrisLVertices = generateCircleVertices(
  -0.57, // center-x
  -0.3, // center-y
  0.025,
  POINTS_ON_CIRCLE
);

const blueEyeRVertices = generateCircleVertices(
  -0.1, // center-x
  -0.3, // center-y
  0.05,
  POINTS_ON_CIRCLE
);

const blueIrisRVertices = generateCircleVertices(
  -0.07, // center-x
  -0.3, // center-y
  0.025,
  POINTS_ON_CIRCLE
);

const blueEyeLVertices = generateCircleVertices(
  0.1, // center-x
  -0.3, // center-y
  0.05,
  POINTS_ON_CIRCLE
);

const blueIrisLVertices = generateCircleVertices(
  0.13, // center-x
  -0.3, // center-y
  0.025,
  POINTS_ON_CIRCLE
);

pacman = createGeometry(gl)
  .attr('vertexPosition', circleVertices, { size: 3 });

pink_eyer = createGeometry(gl)
  .attr('vertexPosition', pinkEyeRVertices, { size: 3 });

pink_irisr = createGeometry(gl)
  .attr('vertexPosition', pinkIrisRVertices, { size: 3 });

pink_eyel = createGeometry(gl)
  .attr('vertexPosition', pinkEyeLVertices, { size: 3 });

pink_irisl = createGeometry(gl)
  .attr('vertexPosition', pinkIrisLVertices, { size: 3 });

blue_eyer = createGeometry(gl)
  .attr('vertexPosition', blueEyeRVertices, { size: 3 });

blue_irisr = createGeometry(gl)
  .attr('vertexPosition', blueIrisRVertices, { size: 3 });

blue_eyel = createGeometry(gl)
  .attr('vertexPosition', blueEyeLVertices, { size: 3 });

blue_irisl = createGeometry(gl)
  .attr('vertexPosition', blueIrisLVertices, { size: 3 });


oneColorShader = createShader(
  gl,
  vsOne,
  fsOne,
  [{ type: 'vec3', name: 'pixelColor' }], // uniforms
  [{ type: 'vec3', name: 'vertexPosition' }] // attributes
);

multiColorShader = createShader(
  gl,
  vsMulti,
  fsMulti,
  [], // this shader does not use uniform variables
  // but it defines two attribute variables
  [{ type: 'vec3', name: 'vertexPos' }, { type: 'vec3', name: 'vertexCol' }]
);

