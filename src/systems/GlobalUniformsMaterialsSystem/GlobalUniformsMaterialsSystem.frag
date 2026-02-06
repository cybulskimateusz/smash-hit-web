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
    vec2 screenUv = (vScreenPos.xy / vScreenPos.w) * 0.5 + 0.5;

    vec2 rotatedUv = rotate(screenUv, vec2(0.5), gTime * 0.5);

    vec2 distortion = vNormal.xy * 0.02;
    vec3 color = texture2D(gBackgroundSampler, rotatedUv + distortion).rgb;

    gl_FragColor = vec4(color, 1.0);
}