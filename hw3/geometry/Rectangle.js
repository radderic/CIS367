import GeometricObject from './GeometricObject';

export default class Rectangle extends GeometricObject {
    constructor({ width = 1.0, depth = 1.0, height = 1.0 }) {
        //x = 2, y = 4, z = 1
        super();
        let x = width / 2;
        let y = depth / 2;
        let z = height / 2;
        //x = 1, y = 2, z = 0.5

        //front face vertices
        let A = [x, y, -z];
        let B = [x, y, z];
        let C = [-x, y, z];
        let D = [-x, y, -z];

        //back face vertices
        let E = [x, -y, -z];
        let F = [x, -y, z];
        let G = [-x, -y, z];
        let H = [-x, -y, -z];

        this.vertices.push(A);
        this.vertices.push(B);
        this.vertices.push(C);
        this.vertices.push(D);
        this.vertices.push(E);
        this.vertices.push(F);
        this.vertices.push(G);
        this.vertices.push(H);

        //A 0
        //B 1
        //C 2
        //D 3
        //E 4
        //F 5
        //G 6
        //H 7

        //front face
        this.triangles.push(3);
        this.triangles.push(1);
        this.triangles.push(0);
        this.triangles.push(2);
        this.triangles.push(1);
        this.triangles.push(3);

        //back face
        this.triangles.push(4);
        this.triangles.push(6);
        this.triangles.push(7);
        this.triangles.push(5);
        this.triangles.push(6);
        this.triangles.push(4);

        //right side face
        this.triangles.push(0);
        this.triangles.push(5);
        this.triangles.push(4);
        this.triangles.push(1);
        this.triangles.push(5);
        this.triangles.push(0);

        //left side face
        this.triangles.push(7);
        this.triangles.push(2);
        this.triangles.push(3);
        this.triangles.push(6);
        this.triangles.push(2);
        this.triangles.push(7);

        //top face
        this.triangles.push(2);
        this.triangles.push(5);
        this.triangles.push(1);
        this.triangles.push(6);
        this.triangles.push(5);
        this.triangles.push(2);

        //bottom face
        this.triangles.push(7);
        this.triangles.push(0);
        this.triangles.push(4);
        this.triangles.push(3);
        this.triangles.push(0);
        this.triangles.push(7);
    }
}
