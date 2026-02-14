uniform float gTime;

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
    vec2 pixelCoord = floor(gl_FragCoord.xy * 0.5);
    float frame = floor(gTime * 24.0);

    float noise = hash(vec3(pixelCoord, frame));

    gl_FragColor = vec4(vec3(noise), 1.0);
}