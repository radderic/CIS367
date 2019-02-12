attribute vec3 vertexPosition;

void main() {
  gl_PointSize = 16.0;
  gl_Position = vec4 (vertexPosition, 1);
}
