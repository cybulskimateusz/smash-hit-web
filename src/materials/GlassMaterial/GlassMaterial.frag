uniform float gTime;
uniform sampler2D gBackgroundSampler;
uniform vec2 gResolution;

uniform vec3 uIndexesOfRefractionRGB;
uniform vec3 uIndexesOfRefractionYCV;
uniform float uRefractionPower;
uniform float uChromaticAberration;
uniform float uSaturation;

varying vec3 vEyeVector;
varying vec3 vWorldNormal;

#pragma glslify: saturate = require('../../shaders/saturate.glsl')

const int LOOP = 16;

void main() {
    vec2 uv = gl_FragCoord.xy / gResolution;
    vec3 color = vec3(0.0);

    for (int i = 0; i < LOOP; i++) {
        float slide = float(i) / float(LOOP) * 0.1;

        vec3 refractionR = refract(vEyeVector, vWorldNormal, uIndexesOfRefractionRGB.r);
        vec3 refractionG = refract(vEyeVector, vWorldNormal, uIndexesOfRefractionRGB.g);
        vec3 refractionB = refract(vEyeVector, vWorldNormal, uIndexesOfRefractionRGB.b);

        vec3 refractionY = refract(vEyeVector, vWorldNormal, uIndexesOfRefractionRGB.r);
        vec3 refractionC = refract(vEyeVector, vWorldNormal, uIndexesOfRefractionRGB.g);
        vec3 refractionV = refract(vEyeVector, vWorldNormal, uIndexesOfRefractionRGB.b);

        float r = texture2D(gBackgroundSampler, uv + refractionR.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).x * 0.5;

        float y = (texture2D(gBackgroundSampler, uv + refractionY.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
                    texture2D(gBackgroundSampler, uv + refractionY.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
                    texture2D(gBackgroundSampler, uv + refractionY.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).z) / 6.0;

        float g = texture2D(gBackgroundSampler, uv + refractionG.xy * (uRefractionPower + slide * 2.0) * uChromaticAberration).y * 0.5;

        float c = (texture2D(gBackgroundSampler, uv + refractionC.xy * (uRefractionPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
                    texture2D(gBackgroundSampler, uv + refractionC.xy * (uRefractionPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
                    texture2D(gBackgroundSampler, uv + refractionC.xy * (uRefractionPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
            
        float b = texture2D(gBackgroundSampler, uv + refractionB.xy * (uRefractionPower + slide * 3.0) * uChromaticAberration).z * 0.5;

        float p = (texture2D(gBackgroundSampler, uv + refractionV.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
                    texture2D(gBackgroundSampler, uv + refractionV.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
                    texture2D(gBackgroundSampler, uv + refractionV.xy * (uRefractionPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

        float R = r + (2.0*p + 2.0*y - c)/3.0;
        float G = g + (2.0*y + 2.0*c - p)/3.0;
        float B = b + (2.0*c + 2.0*p - y)/3.0;

        color.r += R;
        color.g += G;
        color.b += B;

        color = saturate(color, uSaturation);
    }

    color /= float(LOOP);

    gl_FragColor = vec4(color, 1.0);
}