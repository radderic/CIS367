import GeometricObject from './GeometricObject';

let LIMIT = 4; // Limit of the recursion depth
let vertices = [[1,1,1], [-1,-1,1], [1,-1,-1], [-1,1,-1]];
let triangles = [];
let rad = 1.0;

export default class Sphere extends GeometricObject {
    constructor({ radius = 1.0, subdivisions = 4 }) {
        super();
        LIMIT = subdivisions;
        rad = radius;
        //normalize then scale vertices
        for(let g in vertices) {
            for(let v in vertices[0]) {
                vertices[g][v] = (vertices[g][v]/Math.sqrt(3)) * radius;
            }
        }
        split(0, 0, 1, 2);
        split(0, 0, 2, 3);
        split(0, 0, 3, 1);
        split(0, 1, 3, 2);
        this.vertices = vertices;
        this.triangles = triangles;
    }
}

function split(depth, pa, pb, pc) {
    if(depth == LIMIT) {
        triangles.push(pa);
        triangles.push(pb);
        triangles.push(pc);
        return;
    }
    let ab = [
        (vertices[pa][0] + vertices[pb][0]) / 2,
        (vertices[pa][1] + vertices[pb][1]) / 2,
        (vertices[pa][2] + vertices[pb][2]) / 2
    ]

    let norm = Math.sqrt(
        Math.pow(ab[0], 2) +
        Math.pow(ab[1], 2) +
        Math.pow(ab[2], 2))
    //normalize then scale
    for(let n in ab) {
        ab[n] = (ab[n]/norm) * rad;
    }
    vertices.push(ab);
    let pab = vertices.length - 1;

    let ac = [
        (vertices[pa][0] + vertices[pc][0]) / 2,
        (vertices[pa][1] + vertices[pc][1]) / 2,
        (vertices[pa][2] + vertices[pc][2]) / 2
    ]
    norm = Math.sqrt(
        Math.pow(ac[0], 2) +
        Math.pow(ac[1], 2) +
        Math.pow(ac[2], 2))
    for(let n in ac) {
        ac[n] = (ac[n]/norm) * rad;
    }
    vertices.push(ac);
    let pac = vertices.length - 1;

    let bc = [
        (vertices[pb][0] + vertices[pc][0]) / 2,
        (vertices[pb][1] + vertices[pc][1]) / 2,
        (vertices[pb][2] + vertices[pc][2]) / 2
    ]
    norm = Math.sqrt(
        Math.pow(bc[0], 2) +
        Math.pow(bc[1], 2) +
        Math.pow(bc[2], 2))
    for(let n in bc) {
        bc[n] = (bc[n]/norm) * rad;
    }
    vertices.push(bc);
    let pbc = vertices.length - 1;

    split(depth + 1, pa, pab, pac);
    split(depth + 1, pab, pb, pbc);
    split(depth + 1, pc, pac, pbc);
    split(depth + 1, pab, pbc, pac);
}

