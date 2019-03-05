import GLGeometry from 'gl-geometry';
import ObjectGroup from '../core/ObjectGroup';
import Polygonal from '../geometry/Polygonal';
import Rectangle from '../geometry/Rectangle';
import { mat4, vec3 } from 'gl-matrix';

export default class Rocket extends ObjectGroup {
    constructor({ glContext, positionAttribute, colorAttribute }) {
        super();

        let N = 10;
        let bodyGeom = new Polygonal({
            topRadius: 0.25,
            bottomRadius: 0.25,
            height: 0.8,
            numberOfSlices: N
        });

        let bodyColors = [];
        for (let k = 0; k < 2 * N; k++) bodyColors.push([0.3,0.3,0.3]);
        bodyColors.push([0.1,0.1,0.4]);
        bodyColors.push([0.1,0.1,0.4]);
        const body = new GLGeometry(glContext)
          .attr(positionAttribute, bodyGeom.geometry())
          .attr(colorAttribute, bodyColors);
        const bodyCF = mat4.create();
        this.add({ object: body, frame: bodyCF });

        let wingL = new Rectangle({
            width: 0.1,
            depth: 1.0,
            height: 0.5
        });
        let wingLColors = []
        for(let k = 0; k < wingL.vertices.length; k++)
            wingLColors.push([0.5,0.5,0])

         const wingl = new GLGeometry(glContext)
          .attr(positionAttribute, wingL.geometry())
          .attr(colorAttribute, wingLColors);

        const wingLCF = mat4.fromTranslation(mat4.create(), [0, 0.8, 0.4]);
        this.add({ object: wingl, frame: wingLCF });

        let wingR = new Rectangle({
            width: 0.1,
            depth: 1.0,
            height: 0.5
        });
        let wingRColors = []
        for(let k = 0; k < wingR.vertices.length; k++)
            wingRColors.push([0.5,0.5,0])

         const wingr = new GLGeometry(glContext)
          .attr(positionAttribute, wingR.geometry())
          .attr(colorAttribute, wingRColors);

        const wingRCF = mat4.fromTranslation(mat4.create(), [0, -0.8, 0.4]);
        this.add({ object: wingr, frame: wingRCF });
    }
}
