import createContext from 'gl-context';
import GLGeometry from 'gl-geometry';
import createShader from 'gl-shader-core';
import { mat4, glMatrix } from 'gl-matrix';
import fsOne from './shaders/fs_onecolor.glsl';
import vsOne from './shaders/vs_onecolor.glsl';
import vsMulti from './shaders/vs_vertexcolor.glsl';
import fsMulti from './shaders/fs_vertexcolor.glsl';
import Cone from './geometry/Cone';
import Polygonal from './geometry/Polygonal';
import Tetrahedron from './geometry/Tetrahedron';
import Sphere from './geometry/Sphere';
import Arrow from './model/Arrow';
import Axes from './model/Axes';

const POINTS_ON_CIRCLE = 30;
const IDENTITY = mat4.create();

const EYE_POSITION = [2, 2, 3];
const GAZE_POINT = [0, 0, 0.3];
const CAMERA_UP = [0, 0, 1];

// Desired speed of animation
const CONE_SPIN_SPEED = 60.0; // degrees per second
const CONE_REVOLUTION_SPEED = 30.0; // degrees per second
const HEXAGON_SPIN_SPEED = 180.0;
let canvas, gl;
let cone, tube, axes; // geometric objects
let oneColorShader = null;
let multiColorShader = null;
let projectionMatrix, viewMatrix;
let cameraCF, coneCF, tubeCF;
let lastRenderTime = 0;
let cameraRollAngle = 0,
    cameraDistance = 0;
let coneRevolution, coneSpin, hexaSpin;
let tetra, tetraCF;
let camRev;
let earthCF, sunCF, moonCF;
let earth, sun, moon;
let earthRev, sunRev, moonRev;
let earthSpin, sunSpin, moonSpin;

// Inject this render() function into the GLGeometry class
const renderMixin = {
    render(shader, coordFrame) {
        this.bind(shader);
        shader.uniforms.modelView = viewMatrix;
        shader.uniforms.projection = projectionMatrix;
        shader.uniforms.objectCoordFrame = coordFrame;
        this.draw();
        this.unbind();
    }
};
Object.assign(GLGeometry.prototype, renderMixin);

const myObjectRenderer = (geoObject, frame) => {
    if (multiColorShader) {
        // The following line invokes render() defined in the mixin
        geoObject.render(multiColorShader, frame);
    }
};

function renderFunc() {
    const now = Date.now();
    const deltaTime = now - lastRenderTime; // in millisecond
    lastRenderTime = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // By calculating angle from speed, you will experience
    // consistent animation outcome regardless of the actual hardware speed
    // On slower hardware deltaTime will hold a larger value
    // On faster hardware deltaTime will hold a smaller value
//    mat4.fromRotation(
//        coneSpin,
//        glMatrix.toRadian((deltaTime * CONE_SPIN_SPEED) / 1000),
//        [0, 0, 1]
//    );
//    mat4.fromRotation(
//        coneRevolution,
//        glMatrix.toRadian((deltaTime * CONE_REVOLUTION_SPEED) / 1000),
//        [0, 0, 1]
//    );

//    mat4.fromRotation(
//        camRev,
//        glMatrix.toRadian((deltaTime * 20.0) / 1000),
//        [0, 0, 1]
//    );
//    mat4.multiply(cameraCF, camRev, cameraCF);
//    mat4.invert(viewMatrix, cameraCF);

//    moonCF = earthCF;
//    moonCF = mat4.fromTranslation(moonCF, [0, 1.0, 0]);

    // Post-multiply: rotate around its own Z-axis
//    mat4.multiply(coneCF, coneCF, coneSpin);
    // Pre-multiply: rotate arount the world Z-axis
//    mat4.multiply(coneCF, coneRevolution, coneCF);

//    mat4.fromRotation(
//        earthRev,
//        glMatrix.toRadian((deltaTime * 20.0) / 1000),
//        [0, 0, 1]
//    );
//    mat4.multiply(earthCF, earthRev, earthCF);
//    mat4.copy(moonCF, earthCF);

//    mat4.copy(moonCF, earthCF);
    mat4.fromRotation(
        moonRev,
        glMatrix.toRadian((deltaTime * 20.0) / 1000),
        [0, 0, 1]
    );

    mat4.multiply(moonCF, moonRev, moonCF);
    //mat4.fromTranslation(moonCF, [0.0, 1.0, 0.0]);

    mat4.fromRotation(
        earthSpin,
        glMatrix.toRadian((deltaTime * 30.0) / 1000),
        [0, 0, 1]
    );
//    mat4.multiply(earthCF, earthCF, earthSpin);
//    earth.render(multiColorShader, earthCF);

    moon.render(multiColorShader, moonCF);

    axes.render(myObjectRenderer, IDENTITY);
}

function onWindowResized() {
    // Keep the screen aspect ratio at 4:3
    // Keep the canvas as wide as the browser visible width
    let w = window.innerWidth - 16;
    let h = 0.75 * w; // recalculate the canvas height to maintain 4:3 ratio
    if (canvas.offsetTop + h + 16 > window.innerHeight) {
        // the canvas is too tall, take the maximum available height
        canvas.height = window.innerHeight - canvas.offsetTop - 16;
        canvas.width = (4 / 3) * canvas.height;
    } else {
        canvas.width = w;
        canvas.height = h;
    }

    // Tell webGL that the canvas size has changed
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function onRollAngleChanged(ev) {
    // Determine how much we have to rotate from the current angle
    const delta = cameraRollAngle - ev.target.value;
    cameraRollAngle = ev.target.value;

    // Create a rotation matrix (around the camera axis = Z)
    const rota = mat4.fromRotation(mat4.create(), glMatrix.toRadian(delta), [
        0,
        0,
        1
    ]);
    // Update the camera coordinate frame
    mat4.multiply(cameraCF, cameraCF, rota);
    // recalculate view matrix from the camera CF
    mat4.invert(viewMatrix, cameraCF);
}

function onCameraPositionChanged(ev) {
    const delta = cameraDistance - ev.target.value;
    cameraDistance = ev.target.value;
    const trans = mat4.fromTranslation(mat4.create(), [0, 0, delta]);
    // Update the camera coordinate frame
    mat4.multiply(cameraCF, cameraCF, trans);
    // recalculate view matrix from the camera CF
    mat4.invert(viewMatrix, cameraCF);
}

function onProjectionTypeChanged(ev) {
    const type = ev.target.value;
    switch (type) {
        case 'orthotop':
            mat4.ortho(projectionMatrix, -4 / 3, +4 / 3, -1, +1, -4, +4);
            mat4.identity(viewMatrix);
            break;
        case 'orthofront':
            mat4.ortho(projectionMatrix, -4 / 3, +4 / 3, -1, +1, -4, +4);
            mat4.lookAt(viewMatrix, [1,0,0], [0,0,0], [0,0,1]);
            break;
        case 'orthoside':
            mat4.ortho(projectionMatrix, -4 / 3, +4 / 3, -1, +1, -4, +4);
            mat4.lookAt(viewMatrix, [0,1,0], [0,0,0], [0,0,1]);
            break;
        case 'perspective':
            mat4.perspective(projectionMatrix, glMatrix.toRadian(45), 4 / 3, 0.1, 6);
            mat4.lookAt(viewMatrix, EYE_POSITION, GAZE_POINT, CAMERA_UP);
    }
}

// JavaScript does not have main(). We just make it up.
// This function is actually called from index.js
export default function main() {
    // Setup canvas and its render function
    canvas = document.getElementById('mycanvas');
    gl = createContext(canvas, {}, renderFunc);
    projectionMatrix = mat4.create();
    viewMatrix = mat4.create();
    cameraCF = mat4.create();
    coneCF = mat4.fromTranslation(mat4.create(), [0, 1.0, 0]);
    coneRevolution = mat4.create();
    camRev = mat4.create();
    coneSpin = mat4.create();
    hexaSpin = mat4.create();
    tubeCF = mat4.fromTranslation(mat4.create(), [0.2, 0.5, 0]);
    tetraCF = mat4.create();
    earthCF = mat4.fromTranslation(mat4.create(), [0, 1.5, 0]);
    earthRev = mat4.create();
    earthSpin = mat4.create();
    sunCF = mat4.create();
    moonCF = mat4.create();
    mat4.fromTranslation(moonCF, [0, 1.5, 0]);
//    mat4.copy(moonCF, earthCF);
    moonRev = mat4.create();
//    moonCF = mat4.fromTranslation([0, 0.3, 0], moonCF);
    mat4.scale(tetraCF, tetraCF, [0.5,0.5,0.5]);

    // Use perspective projection with 90-degree field-of-view
    // screen aspect ratio 4:3, near plane at z=0.1 far-plane at z=20
    mat4.perspective(projectionMatrix, glMatrix.toRadian(45), 4 / 3, 0.1, 6);
    mat4.lookAt(viewMatrix, EYE_POSITION, GAZE_POINT, CAMERA_UP);
    mat4.invert(cameraCF, viewMatrix);

    // Setup event listeners
    window.addEventListener('resize', onWindowResized);
    document
        .getElementById('cameraRoll')
        .addEventListener('input', onRollAngleChanged);
    document
        .getElementById('cameraZ')
        .addEventListener('input', onCameraPositionChanged);
    document
        .getElementById('projectionType')
        .addEventListener('change', onProjectionTypeChanged);
    onWindowResized(); // call it once to force a manual resize

    gl.clearColor(0.0, 0.0, 0.0, 1); // Use black to clear the canvas

    gl.enable(gl.DEPTH_TEST); // Use DEPTH buffer for hidden surface removal

    // Define our 3D objects here
    const coneShape = new Cone({
        radius: 0.3,
        height: 1.0,
        numberOfSlices: POINTS_ON_CIRCLE
    });

    let coneColors = [];
    for (let k = 0; k < POINTS_ON_CIRCLE; k++) {
        coneColors.push(k % 2, 1, 0); // Perimeter color is YELLOW/GREEN
    }
    coneColors.push(0, 0, 1); // Center at base is BLUE
    coneColors.push(1, 0, 0); // Cone top is RED

    cone = new GLGeometry(gl)
        .attr('vertexPos', coneShape.geometry(), { size: 3 })
        .attr('vertexCol', coneColors, { size: 3 });

    const tetraShape = new Tetrahedron({
        side_length: 1
    });

    let tetraColors = [];
    for(let k = 0; k < 4; k++) {
        tetraColors.push(1,0,0);
    }

    tetra = new GLGeometry(gl)
        .attr('vertexPos', tetraShape.geometry(), { size: 3})
        .attr('vertexCol', tetraColors, { size: 3 });

    const earthShape = new Sphere({
        radius: 0.5,
        subdivisions: 5
    });

    let earthColors = [];
    for(let k = 0; k < earthShape.vertices.length; k++) {
        let r = Math.floor(Math.random() * 100)
        if(r < 60) {
            earthColors.push([0,0,1]);
        }
        else if(r >= 60 && r < 85) {
            earthColors.push([0,1,0]);
        }
        else {
            earthColors.push([1,1,1]);
        }
    }

    earth = new GLGeometry(gl)
        .attr('vertexPos', earthShape.geometry(), { size: 3})
        .attr('vertexCol', earthColors, { size: 3 });

    const moonShape = new Sphere({
        radius: 0.2,
        subdivisions: 5
    });

    let moonColors = [];
    for(let k = 0; k < earthShape.vertices.length; k++) {
        let r = Math.floor(Math.random() * 100)
        if(r < 60) {
            moonColors.push([0.7,0.7,0.7]);
        }
        else if(r >= 60 && r < 85) {
            moonColors.push([0.5,0.5,0.5]);
        }
        else {
            moonColors.push([0.3,0.3,0.3]);
        }
    }

    moon = new GLGeometry(gl)
        .attr('vertexPos', moonShape.geometry(), { size: 3})
        .attr('vertexCol', moonColors, { size: 3 });

    const HEXA_SIDE = 6;
    const cylShape = new Polygonal({
        numberOfSlices: HEXA_SIDE,
        topRadius: 0.1,
        bottomRadius: 0.15,
        height: 0.5
    });
    let cylColors = [];
    // green-white for base circle
    for (let k = 0; k < HEXA_SIDE; k++)
        cylColors.push([(k + 1) % 2, (k + 0) % 2, (k + 1) % 2]);
    // green-black for top circle
    for (let k = 0; k < HEXA_SIDE; k++) cylColors.push([0, k % 2, 0]);
    cylColors.push([1, 1, 1]);
    cylColors.push([1, 1, 1]);

    tube = new GLGeometry(gl)
        .attr('vertexPos', cylShape.geometry())
        .attr('vertexCol', cylColors);

    axes = new Axes({
        glContext: gl,
        positionAttribute: 'vertexPos',
        colorAttribute: 'vertexCol'
    });

    multiColorShader = createShader(
        gl,
        vsMulti,
        fsMulti,
        [
            { type: 'mat4', name: 'modelView' },
            { type: 'mat4', name: 'projection' },
            { type: 'mat4', name: 'objectCoordFrame' }
        ],
        // but it defines two attribute variables
        [{ type: 'vec3', name: 'vertexPos' }, { type: 'vec3', name: 'vertexCol' }]
    );
}
