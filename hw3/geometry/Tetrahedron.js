import GeometricObject from './GeometricObject';

export default class Tetrahedron extends GeometricObject {
    constructor({ side_length = 1.0 }) {
        super();

        //A:0
        this.vertices.push([1, 1, 1]);
        //B:1
        this.vertices.push([-1, -1, 1]);
        //C:2
        this.vertices.push([1, -1, -1]);
        //D:3
        this.vertices.push([-1, 1, -1]);

        this.triangles.push(0, 1, 2);
        this.triangles.push(1, 3, 2);
        this.triangles.push(0, 3, 1);
        this.triangles.push(0, 2, 3);
    }
}
