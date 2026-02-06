uniform float gTime;
uniform sampler2D gBackgroundSampler;
uniform vec2 gResolution;

uniform vec3 uIndexesOfRefraction;
uniform float uRefractionPower;
uniform float uChromaticAberration;

varying vec3 vEyeVector;
varying vec3 vWorldNormal;

const int LOOP = 16;

void main() {
    vec2 uv = gl_FragCoord.xy / gResolution;
    vec3 color = vec3(0.0);

    for (int i = 0; i < LOOP; i++) {
        float slide = float(i) / float(LOOP) * 0.1;

        vec3 refractionR = refract(vEyeVector, vWorldNormal, uIndexesOfRefraction.r);
        vec3 refractionG = refract(vEyeVector, vWorldNormal, uIndexesOfRefraction.g);
        vec3 refractionB = refract(vEyeVector, vWorldNormal, uIndexesOfRefraction.b);

        color.r += texture2D(gBackgroundSampler, uv + refractionR.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).r;
        color.g += texture2D(gBackgroundSampler, uv + refractionG.xy * (uRefractionPower + slide * 2.0) * uChromaticAberration).g;
        color.b += texture2D(gBackgroundSampler, uv + refractionB.xy * (uRefractionPower + slide * 3.0) * uChromaticAberration).b;
    }

    color /= float(LOOP);

    gl_FragColor = vec4(color, 1.0);
}