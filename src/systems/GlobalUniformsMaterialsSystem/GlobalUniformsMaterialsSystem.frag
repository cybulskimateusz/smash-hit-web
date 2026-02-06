uniform float gTime;
uniform sampler2D gBackgroundSampler;
varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vScreenPos;

vec2 rotate(vec2 uv, vec2 center, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    vec2 p = uv - center;
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c) + center;
}

void main() {
    // Screen UV for background sampling
    vec2 screenUv = (vScreenPos.xy / vScreenPos.w) * 0.5 + 0.5;

    // Rotate UV around center based on time
    vec2 rotatedUv = rotate(screenUv, vec2(0.5), gTime * 0.5);

    // Add slight distortion based on normal
    vec2 distortion = vNormal.xy * 0.02;
    vec3 color = texture2D(gBackgroundSampler, rotatedUv + distortion).rgb;

    // Fresnel rim
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 5.0);
    color += fresnel * 3.0;

    gl_FragColor = vec4(color, 1.0);
}