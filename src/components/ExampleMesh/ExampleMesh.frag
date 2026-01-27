  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec3 color1 = vec3(0.0, 1.0, 0.5);
    vec3 color2 = vec3(0.5, 0.0, 1.0);

    float pattern = sin(vUv.x * 10.0 + uTime) * sin(vUv.y * 10.0 + uTime);
    vec3 color = mix(color1, color2, vUv.y + pattern * 0.2);

    gl_FragColor = vec4(color, 1.0);
  }