function main() {
    let canvas = document.getElementById("my-canvas");

    // setupWebGL is defined in webgl-utils.js, it returns a WebGLRenderingContext
    let gl = WebGLUtils.setupWebGL(canvas);

    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then( (prog) => {

            gl.useProgram(prog);
            // Use black RGB=(0,0,0) for the clear color
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // set up the 2D view port (0,0) is upper left (512,512) is lower right corner
            gl.viewport(0, 0, canvas.width, canvas.height);

            // clear the color buffer
            gl.clear(gl.COLOR_BUFFER_BIT);

            let vertices = []
            for(let k = 0; k < 300; k++) {
                let xval = Math.random()*2-1;
                let yval = Math.random()*2-1;
                vertices.push(xval, yval);
            }

            let r = Math.random();
            let g = Math.random();
            let b = Math.random();
            let u_FragColor = gl.getUniformLocation(prog, "u_FragColor");
            gl.uniform3f(u_FragColor, r, g, b);

            // create a buffer
            let vertexBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
            // copy the vertices data
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);
            // obtain a reference to the shader variable (on the GPU)
            let posAttr = gl.getAttribLocation(prog, "vertexPos");
            gl.enableVertexAttribArray(posAttr);
            gl.vertexAttribPointer(posAttr,
                2,         /* number of components per attribute, in our case (x,y) */
                gl.FLOAT,  /* type of each attribute */
                false,     /* does not require normalization */
                0,         /* stride: number of bytes between the beginning of consecutive attributes */
                0);        /* the offset (in bytes) to the first component in the attribute array */

            gl.drawArrays(gl.POINTS,  /* draw only points */
                0,  /* starting index in the array */
                vertices.length/2); /* number of vertices to draw */

        });
}
