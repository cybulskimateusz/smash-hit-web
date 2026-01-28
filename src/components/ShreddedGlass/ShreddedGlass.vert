  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec4 vScreenPos;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vec4 clipPos = projectionMatrix * mvPosition;
    vScreenPos = clipPos;
    gl_Position = clipPos;
  }
