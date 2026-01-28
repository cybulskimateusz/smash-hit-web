uniform sampler2D uSceneTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vScreenPos;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Fresnel
  float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);

  // Screen UV
  vec2 screenUv = vScreenPos.xy / vScreenPos.w * 0.5 + 0.5;

  // Refraction
  vec2 refraction = normal.xy * 0.02;

  // Magnification
  float magnification = 0.95;
  vec2 center = vec2(0.5);
  vec2 magnifiedUv = center + (screenUv - center) * magnification;

  vec2 baseUv = magnifiedUv + refraction;

  // -------------------------
  // Chromatic Aberration
  // -------------------------
// Edge factor (0 center → 1 edges)
float edge = length(screenUv - 0.5) * 2.0;

// Master control
float chromaStrength = 0.0025;

// Final strength shaped by edge + fresnel
float chroma = chromaStrength * edge * (0.3 + fresnel);

// Slight channel imbalance feels more natural
vec2 chromaOffsetR = refraction * chroma * 1.2;
vec2 chromaOffsetB = refraction * chroma * 0.8;

float r = texture2D(uSceneTexture, baseUv + chromaOffsetR).r;
float g = texture2D(uSceneTexture, baseUv).g;
float b = texture2D(uSceneTexture, baseUv - chromaOffsetB).b;

vec3 sceneColor = vec3(r, g, b);

  // Glass tint
  vec3 glassTint = vec3(0.9, 0.95, 1.0);
  vec3 tintedColor = sceneColor * glassTint;

  // Edge highlight
  float specular = pow(fresnel, 4.0);

  vec3 finalColor = tintedColor + vec3(specular);

  finalColor.gb *= 1.3;

  gl_FragColor = vec4(finalColor, 1.0);
}