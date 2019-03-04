import GLGeometry from 'gl-geometry';
import ObjectGroup from '../core/ObjectGroup';
import Polygonal from '../geometry/Polygonal';
import Cone from '../geometry/Cone';
import { mat4, vec3 } from 'gl-matrix';

export default class Rocket extends ObjectGroup {
    constructor({ glContext, positionAttribute, colorAttribute, color }) {
        super();
    }
}
