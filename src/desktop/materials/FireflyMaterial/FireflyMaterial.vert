uniform float gTime;
attribute float aOffset;
varying float vOffset;

void main() {
  vOffset = aOffset;

  vec3 pos = position;

  // Gentle floating motion
  float timeOffset = gTime * 0.5 + aOffset * 6.28;
  pos.x += sin(timeOffset) * 0.3;
  pos.y += cos(timeOffset * 0.7) * 0.2;
  pos.z += sin(timeOffset * 0.5) * 0.3;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 80.0 / -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}
