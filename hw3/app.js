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
import Rocket from './model/Rocket';

const POINTS_ON_CIRCLE = 30;
const IDENTITY = mat4.create();

const EYE_POSITION = [56, 56, 72];
//const EYE_POSITION = [4, 4, 6];
const GAZE_POINT = [0, 0, 0.3];
const CAMERA_UP = [0, 0, 1];

let canvas, gl;
let cone, tube, axes; // geometric objects
let oneColorShader = null;
let multiColorShader = null;
let projectionMatrix, viewMatrix;
let selectedView;
let cameraCF, coneCF, tubeCF;
let lastRenderTime = 0;
let cameraRollAngle = 0,
    cameraDistance = 0;
let coneRevolution, coneSpin, hexaSpin;
let camRev;
let earthCF, sunCF, moonCF, mercuryCF, venusCF;
let earth, sun, moon, mercury, venus;
let earthRev, moonRev, mercuryRev, venusRev;
let earthSpin, sunSpin, moonSpin, mercurySpin, venusSpin;
let moonTrans;
let rocket, rocketCF;

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

    // Post-multiply: rotate around its own Z-axis
//    mat4.multiply(coneCF, coneCF, coneSpin);
    // Pre-multiply: rotate arount the world Z-axis
//    mat4.multiply(coneCF, coneRevolution, coneCF);
    //
    if(selectedView === 'mercury') {
        let eyeTrans = mat4.create();
        mat4.clone(eyeTrans, mercuryCF);
//        mat4.translate(eyeTrans, eyeTrans, [0.5, 1.0, 1.0]);
        mat4.lookAt(viewMatrix, mercuryCF, [0,0,0], CAMERA_UP);
        //mat4.lookAt(viewMatrix, EYE_POSITION, GAZE_POINT, CAMERA_UP);
    }

    //Earth orbiting
    mat4.fromRotation(
        earthRev,
        glMatrix.toRadian((deltaTime * 10.0) / 1000),
        [0, 0, 1]
    );
    mat4.multiply(earthCF, earthRev, earthCF);

    mat4.fromRotation(
        earthSpin,
        glMatrix.toRadian((deltaTime * -50.0) / 1000),
        [0, 0, 1]
    );
    mat4.multiply(earthCF, earthCF, earthSpin);
    earth.render(multiColorShader, earthCF);

    mat4.fromRotation(
        mercuryRev,
        glMatrix.toRadian((deltaTime * 16.0) / 1000),
        [0, 0, 1]
    );
    mat4.multiply(mercuryCF, mercuryRev, mercuryCF);

    mat4.fromRotation(
        mercurySpin,
        glMatrix.toRadian((deltaTime * -50.0) / 1000),
        [0, 0, 1]
    );
    mat4.multiply(mercuryCF, mercuryCF, mercurySpin);
    mercury.render(multiColorShader, mercuryCF);

    mat4.fromRotation(
        venusRev,
        glMatrix.toRadian((deltaTime * 20.0) / 1000),
        [0, 0, 1]
    );
    mat4.multiply(venusCF, venusRev, venusCF);

    mat4.fromRotation(
        venusSpin,
        glMatrix.toRadian((deltaTime * -50.0) / 1000),
        [0, 0, 1]
    );
    mat4.multiply(venusCF, venusCF, venusSpin);
    venus.render(multiColorShader, venusCF);

    /* make moon orbit around the origin */
    //calculate moon orbit
    mat4.fromRotation(moonRev, glMatrix.toRadian((deltaTime * 180.0) / 1000), [0, 0, 1]);
    //apply rotation/orbit to moonCF
    mat4.multiply(moonCF, moonRev, moonCF);

    /* Translate the moon and it's rotation to match the earthCF position */
    //copy earthCF for moon
    mat4.copy(moonTrans, earthCF);
    mat4.multiply(moonTrans, moonTrans, moonCF);
    moon.render(multiColorShader, moonTrans);


    mat4.fromRotation(
        sunSpin,
        glMatrix.toRadian((deltaTime * -30.0) / 1000),
        [0, 0, 1]
    );
    mat4.multiply(sunCF, sunCF, sunSpin);
//    sun.render(multiColorShader, sunCF);

    axes.render(myObjectRenderer, IDENTITY);
    
    mat4.translate(rocketCF, rocketCF, [0.0, 0.0, 0.1]);
    rocket.render(myObjectRenderer, rocketCF);
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
            mat4.perspective(projectionMatrix, glMatrix.toRadian(45), 4 / 3, 0.4, null);
            mat4.lookAt(viewMatrix, EYE_POSITION, GAZE_POINT, CAMERA_UP);
    }
}

function planet(ev) {
    const type = ev.target.value;
    switch (type) {
        case 'mercury':
            selectedView = 'mercury';
            break;
        case 'venus':
            mat4.lookAt(viewMatrix, [1,0,0], [0,0,0], [0,0,1]);
            break;
        case 'earth':
            mat4.lookAt(viewMatrix, [0,1,0], [0,0,0], [0,0,1]);
            break;
        case 'none':
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

    earthCF = mat4.fromTranslation(mat4.create(), [0, 40, 0]);
    earthRev = mat4.create();
    earthSpin = mat4.create();

    sunCF = mat4.create();
    sunSpin = mat4.create();

    moonCF = mat4.create();
    moonTrans = mat4.create();
    mat4.translate(moonCF, moonCF, [0, 3.0, 0]);
    moonRev = mat4.create();

    mercuryCF = mat4.fromTranslation(mat4.create(), [0, 20, 0]);
    mercuryRev = mat4.create();
    mercurySpin = mat4.create();

    venusCF = mat4.fromTranslation(mat4.create(), [0, 30, 0]);
    venusRev = mat4.create();
    venusSpin = mat4.create();

    rocketCF = mat4.create();
    mat4.rotate(rocketCF, rocketCF, glMatrix.toRadian(45.3), [0,0,1]);
    mat4.rotate(rocketCF, rocketCF, glMatrix.toRadian(47), [0,1,0]);

    // Use perspective projection with 90-degree field-of-view
    // screen aspect ratio 4:3, near plane at z=0.1 far-plane at z=20
    mat4.perspective(projectionMatrix, glMatrix.toRadian(45), 4 / 3, 0.1, null);
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
    document
        .getElementById('planet')
        .addEventListener('change', planet);
    onWindowResized(); // call it once to force a manual resize

    gl.clearColor(0.0, 0.0, 0.0, 1); // Use black to clear the canvas

    gl.enable(gl.DEPTH_TEST); // Use DEPTH buffer for hidden surface removal

    const moonShape = new Sphere({
        radius: 0.2,
        subdivisions: 5
    });

    let moonColors = [];
    for(let k = 0; k < moonShape.vertices.length; k++) {
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


    const sunShape = new Sphere({
        radius: 10.0,
        subdivisions: 5
    });

    let sunColors = [];
    for(let k = 0; k < sunShape.vertices.length; k++) {
        let r = Math.floor(Math.random() * 100)
        if(r < 50) {
            sunColors.push([1,1,0]);
        }
        else if(r >= 50 && r < 85) {
            sunColors.push([1,0.5,0]);
        }
        else {
            sunColors.push([1,0,0]);
        }
    }

    sun = new GLGeometry(gl)
        .attr('vertexPos', sunShape.geometry(), { size: 3})
        .attr('vertexCol', sunColors, { size: 3 });


    const mercuryShape = new Sphere({
        radius: 0.25,
        subdivisions: 5
    });

    let mercuryColors = [];
    for(let k = 0; k < mercuryShape.vertices.length; k++) {
        let r = Math.floor(Math.random() * 100)
        if(r < 60) {
            mercuryColors.push([0.8,0.8,0.8]);
        }
        else if(r >= 60 && r < 85) {
            mercuryColors.push([0.7,0.7,0.7]);
        }
        else {
            mercuryColors.push([0.6,0.6,0.6]);
        }
    }

    mercury = new GLGeometry(gl)
        .attr('vertexPos', mercuryShape.geometry(), { size: 3})
        .attr('vertexCol', mercuryColors, { size: 3 });

    const venusShape = new Sphere({
        radius: 0.4,
        subdivisions: 5
    });

    let venusColors = [];
    for(let k = 0; k < venusShape.vertices.length; k++) {
        let r = Math.floor(Math.random() * 100)
        if(r < 60) {
            venusColors.push([0.8,0.5,0.2]);
        }
        else if(r >= 60 && r < 85) {
            venusColors.push([0.6,0.4,0.4]);
        }
        else {
            venusColors.push([0.2,0.2,0.2]);
        }
    }

    venus = new GLGeometry(gl)
        .attr('vertexPos', venusShape.geometry(), { size: 3})
        .attr('vertexCol', venusColors, { size: 3 });

   axes = new Axes({
        glContext: gl,
        positionAttribute: 'vertexPos',
        colorAttribute: 'vertexCol'
    });

    rocket = new Rocket({
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
