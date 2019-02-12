// in fshader.glsl
precision mediump float;
uniform vec3 u_FragColor;
void main() {
    gl_FragColor = vec4(u_FragColor, 1.0);
}
