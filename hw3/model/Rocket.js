import GLGeometry from 'gl-geometry';
import ObjectGroup from '../core/ObjectGroup';
import Polygonal from '../geometry/Polygonal';
import Cone from '../geometry/Cone';
import { mat4, vec3 } from 'gl-matrix';

export default class Rocket extends ObjectGroup {
    constructor({ glContext, positionAttribute, colorAttribute }) {
        super();
        let N = 10;

        let bodyGeom = new Polygonal({
            topRadius: 0.15,
            bottomRadius: 0.15,
            height: 1.2,
            numberOfSlices: N
        });

        let bodyColors = [];
        for (let k = 0; k < 2 * N + 2; k++) bodyColors.push([1,1,1]);
        const body = new GLGeometry(glContext)
          .attr(positionAttribute, bodyGeom.geometry())
          .attr(colorAttribute, bodyColors);
        const bodyCF = mat4.create();
        this.add({ object: body, frame: bodyCF });

        let coneGeom = new Cone({ numberOfSlices: N, radius: 0.20, height: 0.4 });
        let coneColors = [];
        for (let k = 0; k < N + 2; k++) coneColors.push([1,0,0]);
        const cone = new GLGeometry(glContext)
          .attr(positionAttribute, coneGeom.geometry())
          .attr(colorAttribute, coneColors);
        const coneCF = mat4.fromTranslation(mat4.create(), [0, 0, 1.2]);
        this.add({ object: cone, frame: coneCF });

        //engine1
        let eng1Geom = new Polygonal({
            topRadius: 0.08,
            bottomRadius: 0.10,
            height: 0.6,
            numberOfSlices: N
        });
        let eng1Colors = [];
        for (let k = 0; k < 2 * N + 2; k++) eng1Colors.push([0,0,1]);
        const eng1 = new GLGeometry(glContext)
          .attr(positionAttribute, eng1Geom.geometry())
          .attr(colorAttribute, eng1Colors);
        const eng1CF = mat4.fromTranslation(mat4.create(), [0.0, 0.2, -0.2]);
        this.add({ object: eng1, frame: eng1CF });

        //engine2
        let eng2Geom = new Polygonal({
            topRadius: 0.08,
            bottomRadius: 0.10,
            height: 0.6,
            numberOfSlices: N
        });
        let eng2Colors = [];
        for (let k = 0; k < 2 * N + 2; k++) eng2Colors.push([0,0,1]);
        const eng2 = new GLGeometry(glContext)
          .attr(positionAttribute, eng2Geom.geometry())
          .attr(colorAttribute, eng2Colors);
        const eng2CF = mat4.fromTranslation(mat4.create(), [0.0, -0.2, -0.2]);
        this.add({ object: eng2, frame: eng2CF });

        //engine3
        let eng3Geom = new Polygonal({
            topRadius: 0.08,
            bottomRadius: 0.10,
            height: 0.6,
            numberOfSlices: N
        });
        let eng3Colors = [];
        for (let k = 0; k < 2 * N + 2; k++) eng3Colors.push([0,0,1]);
        const eng3 = new GLGeometry(glContext)
          .attr(positionAttribute, eng3Geom.geometry())
          .attr(colorAttribute, eng3Colors);
        const eng3CF = mat4.fromTranslation(mat4.create(), [0.2, 0.0, -0.2]);
        this.add({ object: eng3, frame: eng3CF });

        let eng4Geom = new Polygonal({
            topRadius: 0.08,
            bottomRadius: 0.10,
            height: 0.6,
            numberOfSlices: N
        });
        let eng4Colors = [];
        for (let k = 0; k < 2 * N + 2; k++) eng4Colors.push([0,0,1]);
        const eng4 = new GLGeometry(glContext)
          .attr(positionAttribute, eng4Geom.geometry())
          .attr(colorAttribute, eng4Colors);
        const eng4CF = mat4.fromTranslation(mat4.create(), [-0.2, 0.0, -0.2]);
        this.add({ object: eng4, frame: eng4CF });
    }
}
