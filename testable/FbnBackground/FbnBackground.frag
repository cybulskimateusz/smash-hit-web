precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;

#pragma glslify: fbm = require('../../src/shaders/fbm.glsl')

// Color palette function
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;
    
    // Animate the FBM
    vec2 p = uv * 3.0;
    p += uTime * 0.1;
    
    // Layer multiple FBM patterns
    float f1 = fbm(p + uTime * 0.2);
    float f2 = fbm(p + vec2(f1 * 2.0) + uTime * 0.15);
    float f3 = fbm(p + vec2(f2 * 2.0) - uTime * 0.1);
    
    // Combine patterns
    float finalPattern = (f1 + f2 + f3) / 3.0;
    
    // Add some movement
    finalPattern += sin(uv.x * 3.0 + uTime) * 0.1;
    finalPattern += cos(uv.y * 3.0 + uTime * 0.8) * 0.1;
    
    // Apply color palette
    vec3 color = palette(finalPattern + uTime * 0.1);
    
    // Add some variation with another palette
    vec3 color2 = palette(finalPattern * 2.0 - uTime * 0.05);
    color = mix(color, color2, 0.3);
    
    // Vignette effect
    float vignette = 1.0 - length(uv) * 0.3;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}