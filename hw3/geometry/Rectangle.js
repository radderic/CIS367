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

        //front face
        this.triangles.push(A);
        this.triangles.push(B);
        this.triangles.push(D);
        this.triangles.push(D);
        this.triangles.push(B);
        this.triangles.push(C);

        //back face
        this.triangles.push(H);
        this.triangles.push(G);
        this.triangles.push(E);
        this.triangles.push(E);
        this.triangles.push(G);
        this.triangles.push(F);

        //right side face
        this.triangles.push(E);
        this.triangles.push(F);
        this.triangles.push(A);
        this.triangles.push(A);
        this.triangles.push(F);
        this.triangles.push(B);

        //left side face
        this.triangles.push(D);
        this.triangles.push(C);
        this.triangles.push(H);
        this.triangles.push(H);
        this.triangles.push(C);
        this.triangles.push(G);

        //top face
        this.triangles.push(B);
        this.triangles.push(F);
        this.triangles.push(C);
        this.triangles.push(C);
        this.triangles.push(F);
        this.triangles.push(G);

        //bottom face
        this.triangles.push(E);
        this.triangles.push(A);
        this.triangles.push(H);
        this.triangles.push(H);
        this.triangles.push(A);
        this.triangles.push(D);
    }
}
