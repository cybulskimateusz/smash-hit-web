varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vScreenPos;

void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenPos = clipPos;
    gl_Position = clipPos;
}