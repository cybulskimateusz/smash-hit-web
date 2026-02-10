uniform float gTime;
uniform vec3 uColor;
varying float vOffset;

void main() {
  // Circular point with soft edges
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  if (dist > 0.5) discard;

  // Soft glow falloff
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  alpha = pow(alpha, 1.5);

  // Flickering brightness
  float flicker = sin(gTime * 3.0 + vOffset * 20.0) * 0.3 + 0.7;
  float pulse = sin(gTime * 0.5 + vOffset * 10.0) * 0.2 + 0.8;

  vec3 color = uColor * flicker * pulse;

  gl_FragColor = vec4(color, alpha * 0.8);
}
